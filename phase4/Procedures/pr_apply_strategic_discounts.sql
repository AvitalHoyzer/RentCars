CREATE OR REPLACE PROCEDURE public.pr_apply_strategic_discounts()
AS $$
DECLARE
    -- A. Define an Explicit Cursor to fetch rental companies row by row
    cur_companies CURSOR FOR 
        SELECT rc.company_id, rc.company_name, c.city_name 
        FROM public.rental_company rc
        JOIN public.city c ON rc.city_id = c.city_id;
        
    -- B. Define a Record variable to hold data stream states
    r_company RECORD;
    v_city_index INT;
    v_updated_cars_count INT;
BEGIN
    RAISE NOTICE '=== STARTING STRATEGIC DISCOUNT UPDATE PROCESS ===';

    -- 1. Open the Explicit Cursor and loop through rental companies
    OPEN cur_companies;
    LOOP
        FETCH cur_companies INTO r_company;
        EXIT WHEN NOT FOUND; -- Loop breaking condition

        -- 2. Call our analytical function inside the loop to determine city performance
        v_city_index := public.fn_calculate_city_health_index(r_company.city_name);

        -- 3. Execute complex branching logic: if city health score is weak (< 60), apply a 10% markdown
        IF v_city_index < 60 THEN
            RAISE NOTICE 'Target Found: Company "%" is located in low-performing city "%" (Score: %). Applying 10%% discount...', 
                         r_company.company_name, r_company.city_name, v_city_index;
            
            -- 4. Execute DML Update Statement modifying car asset values matching the company
            -- FIXED: Changed column name from 'price' to 'price_per_day'
            UPDATE public.car
            SET price_per_day = ROUND(price_per_day * 0.90, 2)
            WHERE company_id = r_company.company_id;
            
            -- Get the count of affected database rows
            GET DIAGNOSTICS v_updated_cars_count = ROW_COUNT;
            RAISE NOTICE 'DML Complete: Updated % cars for company ID %.', v_updated_cars_count, r_company.company_id;
        ELSE
            RAISE NOTICE 'Skipping Company "%" in city "%" (Score: % is stable).', 
                         r_company.company_name, r_company.city_name, v_city_index;
        END IF;
        
    END LOOP;
    CLOSE cur_companies;
    
    RAISE NOTICE '=== STRATEGIC DISCOUNT PROCESS COMPLETED SUCCESSFULLY ===';

-- C. Robust exception handling to prevent total operational failure
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Critical Error encountered during batch DML update: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;