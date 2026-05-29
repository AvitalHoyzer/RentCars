/*******************************************************************************
    Main Program 2: Customer Operations & Activity Retrieval Workflow
    Invokes: Procedure (pr_book_integrated_package) & Function (fn_get_tourist_activity)
*******************************************************************************/
DO $$
DECLARE
    -- Local tracking variables for the main loop operations
    v_target_tourist INT := 1;
    v_activity_cursor REFCURSOR;
    
    -- Variables to capture the structured data stream from the Ref Cursor
    r_review_id INT; r_title VARCHAR; r_score INT; r_type VARCHAR; r_branch VARCHAR; r_spend NUMERIC;
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE '   STARTING MAIN OPERATIONAL PROGRAM 2 (BOOKINGS)  ';
    RAISE NOTICE '==================================================';

    -- 1. Invoke the Complex Multi-DML Package Booking Stored Procedure
    RAISE NOTICE 'Step 1: Committing new synchronized reservation package for Tourist ID %...', v_target_tourist;
    CALL public.pr_book_integrated_package(
        v_target_tourist, -- Tourist ID
        1,                -- Car ID
        1, 1,             -- Pickup & Return City IDs
        '2026-09-01'::DATE, '2026-09-05'::DATE, -- Travel Window Dates
        1,                -- Restaurant ID
        '2026-09-03'::DATE, -- Restaurant Reservation Date
        4                 -- Number of guests (Group size)
    );

    RAISE NOTICE '--------------------------------------------------';

    -- 2. Invoke the Ref Cursor Function to fetch updated tourist records
    RAISE NOTICE 'Step 2: Retrieving updated ledger records via Ref Cursor output stream...';
    v_activity_cursor := public.fn_get_tourist_activity(v_target_tourist);
    
    -- Extract and map data records streaming from the open Ref Cursor
    LOOP
        FETCH NEXT FROM v_activity_cursor INTO r_review_id, r_title, r_score, r_type, r_branch, r_spend;
        EXIT WHEN NOT FOUND; -- Loop breakdown control rule
        
        RAISE NOTICE 'Activity Pulled -> Sector: % | Review Title: "%" | Current Total Spend Ledger: %', 
                     r_type, r_title, r_spend;
    END LOOP;
    
    CLOSE v_activity_cursor; -- Clean up database resource allocation markers

    RAISE NOTICE '==================================================';
    RAISE NOTICE '        MAIN PROGRAM 2 COMPLETED SUCCESSFULLY      ';
    RAISE NOTICE '==================================================';
END $$;