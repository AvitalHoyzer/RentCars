/*******************************************************************************
    Main Program 1: Executive Analytics & Strategic Promotions Workflow
    Invokes: Function (fn_calculate_city_health_index) & Procedure (pr_apply_strategic_discounts)
*******************************************************************************/
DO $$
DECLARE
    v_test_city VARCHAR := 'Puyang';
    v_calculated_score INT;
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE '   STARTING MAIN EXECUTIVE PROGRAM 1 (ANALYTICS)   ';
    RAISE NOTICE '==================================================';

    -- 1. Invoke the Analytical Function directly within the main program execution
    RAISE NOTICE 'Step 1: Running diagnostic check on target market...';
    v_calculated_score := public.fn_calculate_city_health_index(v_test_city);
    RAISE NOTICE 'Main Program Verified: City "%" holds a recorded score of %/100.', v_test_city, v_calculated_score;

    RAISE NOTICE '--------------------------------------------------';

    -- 2. Invoke the Administrative Batch Processing Stored Procedure
    RAISE NOTICE 'Step 2: Launching global strategic markdown algorithm...';
    CALL public.pr_apply_strategic_discounts();

    RAISE NOTICE '==================================================';
    RAISE NOTICE '        MAIN PROGRAM 1 COMPLETED SUCCESSFULLY      ';
    RAISE NOTICE '==================================================';
END $$;