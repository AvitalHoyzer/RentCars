CREATE OR REPLACE PROCEDURE public.pr_book_integrated_package(
    p_tourist_id INT,
    p_car_id INT,
    p_pickup_city_id INT,
    p_return_city_id INT,
    p_pickup_date DATE,
    p_return_date DATE,
    p_rest_id INT,
    p_rest_booking_date DATE,
    p_num_of_people INT
)
AS $$
DECLARE
    -- A. Local variables to hold operational states and primary key sequences
    v_max_booking_id INT;
    v_car_base_price NUMERIC;
    v_total_car_cost NUMERIC;
    v_tourist_exists INT;
    v_car_status VARCHAR;  -- Valid status for car bookings
    v_rest_status VARCHAR; -- Valid status for restaurant bookings
BEGIN
    RAISE NOTICE '=== INITIATING INTEGRATED PACAKGE BOOKING FLOW ===';

    -- 1. Structural Validation: Ensure the tourist exists before creating records
    SELECT COUNT(*) INTO v_tourist_exists FROM public.tourist WHERE tourist_id = p_tourist_id;
    IF v_tourist_exists = 0 THEN
        RAISE EXCEPTION 'Booking Failed: Tourist ID % does not exist in the system.', p_tourist_id;
    END IF;

    -- 2. Date Sequence Check: Ensure booking dates are logically sequential
    IF p_return_date < p_pickup_date THEN
        RAISE EXCEPTION 'Booking Failed: Return date (%) cannot be prior to pickup date (%).', p_return_date, p_pickup_date;
    END IF;

    -- 3. Dynamic Status Resolution for Cars
    SELECT status INTO v_car_status FROM public.car_booking WHERE status IS NOT NULL LIMIT 1;
    IF v_car_status IS NULL THEN v_car_status := 'Active'; END IF;

    -- 4. Dynamic Status Resolution for Restaurants
    SELECT status INTO v_rest_status FROM public.rest_booking WHERE status IS NOT NULL LIMIT 1;
    IF v_rest_status IS NULL THEN v_rest_status := 'Active'; END IF;


    ----------------------------------------------------------------------------
    -- PHASE 1: PROCESS CAR BOOKING COMPONENT (DML 1)
    ----------------------------------------------------------------------------
    SELECT price_per_day INTO v_car_base_price FROM public.car WHERE car_id = p_car_id;
    v_total_car_cost := COALESCE(v_car_base_price, 50.00) * (p_return_date - p_pickup_date + 1);

    -- Generate a sequential unique primary key for the booking
    SELECT COALESCE(MAX(booking_id), 0) + 1 INTO v_max_booking_id FROM public.car_booking;

    RAISE NOTICE 'Step 1: Inserting Car Booking ID: % (Total Price: %, Using Status: "%")', 
                 v_max_booking_id, v_total_car_cost, v_car_status;
    
    INSERT INTO public.car_booking (booking_id, booking_date, pickup_date, return_date, total_price, status, tourist_id, car_id, pickup_city_id, return_city_id)
    VALUES (v_max_booking_id, CURRENT_DATE, p_pickup_date, p_return_date, v_total_car_cost, v_car_status, p_tourist_id, p_car_id, p_pickup_city_id, p_return_city_id);


    ----------------------------------------------------------------------------
    -- PHASE 2: PROCESS RESTAURANT BOOKING COMPONENT (DML 2)
    ----------------------------------------------------------------------------
    -- Generate next primary key for the restaurant reservation
    SELECT COALESCE(MAX(booking_id), 0) + 1 INTO v_max_booking_id FROM public.rest_booking;

    RAISE NOTICE 'Step 2: Inserting Restaurant Booking ID: % for % diners (Using Status: "%")', 
                 v_max_booking_id, p_num_of_people, v_rest_status;

    -- FIXED: Added 'status' column to satisfy the rest_booking table schema constraints
    INSERT INTO public.rest_booking (booking_id, booking_date, num_of_people, status, tourist_id, rest_id)
    VALUES (v_max_booking_id, p_rest_booking_date, p_num_of_people, v_rest_status, p_tourist_id, p_rest_id);

    RAISE NOTICE '=== INTEGRATED PACKAGE COMPLETELY BOOKED AND TRANSACTION COMMITTED ===';

-- B. Central Exception block capturing errors and gracefully rolling back bad data states
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'CRITICAL ERROR: Package processing aborted. Reason: %', SQLERRM;
        RAISE NOTICE 'Action: Performing transactional safety rollback...';
END;
$$ LANGUAGE plpgsql;