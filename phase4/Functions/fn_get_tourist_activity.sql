CREATE OR REPLACE FUNCTION public.fn_get_tourist_activity(p_tourist_id INT)
RETURNS REFCURSOR AS $$
DECLARE
    -- A. Define a Ref Cursor to return the consolidated dynamic data set
    activity_cursor REFCURSOR := 'tourist_activity_results';
    
    -- B. Define an Explicit Cursor to scan and aggregate car booking expenses
    cur_car_spent CURSOR FOR 
        SELECT total_price FROM public.car_booking WHERE tourist_id = p_tourist_id;
        
    -- C. Define local variables for tracking states and calculations
    v_tourist_exists INT;
    v_car_price NUMERIC(10,2);
    v_total_spent NUMERIC(10,2) := 0.00;
BEGIN
    -- 1. Validate if the tourist exists in the unified registry (throw exception if missing)
    SELECT COUNT(*) INTO v_tourist_exists FROM public.tourist WHERE tourist_id = p_tourist_id;
    IF v_tourist_exists = 0 THEN
        RAISE EXCEPTION 'Tourist with ID % does not exist in the database.', p_tourist_id;
    END IF;

    -- 2. Open the Explicit Cursor and loop through records to compute aggregate expenditures
    OPEN cur_car_spent;
    LOOP
        FETCH cur_car_spent INTO v_car_price;
        EXIT WHEN NOT FOUND; -- Loop exit condition
        v_total_spent := v_total_spent + COALESCE(v_car_price, 0);
    END LOOP;
    CLOSE cur_car_spent;

    -- 3. Log the aggregate metric to the database server notification console
    RAISE NOTICE 'Log: Tourist ID % has a total calculated car rental expense of: %', p_tourist_id, v_total_spent;

    -- 4. Open the Ref Cursor with a polymorphic join statement merging sectors
    OPEN activity_cursor FOR
        SELECT 
            r.review_id,
            r.review_title,
            rat.rate_num AS score,
            rat.rating_type,
            CASE 
                WHEN r.car_id IS NOT NULL THEN 'Car Asset ID: ' || r.car_id
                WHEN r.rest_id IS NOT NULL THEN 'Restaurant Asset ID: ' || r.rest_id
                ELSE 'General Review'
            END AS business_branch,
            v_total_spent AS cumulative_car_spend
        FROM public.review r
        JOIN public.rating rat ON r.review_id = rat.review_id
        WHERE r.tourist_id = p_tourist_id;

    RETURN activity_cursor;

-- D. Exception handling block to capture structural errors and protect runtime flow
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred in fn_get_tourist_activity: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;