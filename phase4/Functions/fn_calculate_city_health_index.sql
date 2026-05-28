CREATE OR REPLACE FUNCTION public.fn_calculate_city_health_index(p_city_name VARCHAR)
RETURNS INT AS $$
DECLARE
    -- A. Define local tracking variables for aggregated satisfaction metrics
    -- Unconstrained NUMERIC to prevent field overflow
    v_city_id INT;
    v_avg_rest_rating NUMERIC := 0;
    v_avg_car_rating NUMERIC := 0;
    v_combined_score NUMERIC := 0;
    v_final_index INT := 0;
BEGIN
    -- 1. Resolve city identifier from unformatted text input string (Implicit Cursor)
    SELECT city_id INTO v_city_id FROM public.city WHERE LOWER(TRIM(city_name)) = LOWER(TRIM(p_city_name));
    
    IF v_city_id IS NULL THEN
        RAISE EXCEPTION 'City name "%" not found in the normalized registry.', p_city_name;
    END IF;

    -- 2. Calculate average score across restaurant reviews within the target city
    SELECT AVG(rat.rate_num) INTO v_avg_rest_rating
    FROM public.restaurant rest
    JOIN public.review rev ON rest.rest_id = rev.rest_id
    JOIN public.rating rat ON rev.review_id = rat.review_id
    WHERE rest.city_id = v_city_id;

    -- 3. Calculate average score across car rental reviews linked to the target city
    SELECT AVG(rat.rate_num) INTO v_avg_car_rating
    FROM public.car_booking cb
    JOIN public.review rev ON cb.car_id = rev.car_id
    JOIN public.rating rat ON rev.review_id = rat.review_id
    WHERE cb.pickup_city_id = v_city_id;

    -- 4. Execute complex branching conditional logic to weight and establish index metrics
    IF v_avg_rest_rating IS NULL AND v_avg_car_rating IS NULL THEN
        v_final_index := 50; -- Default neutral benchmark for cities with zero feedback metrics
    ELSE
        -- Compile cross-sector weights and map score onto a 1-100 percentage layout
        v_combined_score := (COALESCE(v_avg_rest_rating, 3.0) + COALESCE(v_avg_car_rating, 3.0)) / 2.0;
        v_final_index := CAST((v_combined_score / 5.0) * 100 AS INT);
    END IF;

    -- 5. Cap index values to guarantee boundaries do not exceed the mathematical 100 benchmark
    IF v_final_index > 100 THEN 
        v_final_index := 100; 
    END IF;

    RAISE NOTICE 'Analysis Complete: City "%" (ID: %) scored a Business Health Index of: %/100', p_city_name, v_city_id, v_final_index;
    RETURN v_final_index;

-- B. Fault-tolerant handler block preventing runtime division-by-zero crashes
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Warning: Calculation blocked for city "%". Reason: %', p_city_name, SQLERRM;
        RETURN 0;
END;
$$ LANGUAGE plpgsql;