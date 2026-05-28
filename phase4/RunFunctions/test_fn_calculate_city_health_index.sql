/*******************************************************************************
                   Verification for fn_calculate_city_health_index
*******************************************************************************/

-- Test Scenario 1: Normal Execution (Valid Active City - e.g., 'Tallinn')
-- Expected: Numerical index score out of 100 under 'Data Output' and log analysis under 'Messages'.
SELECT public.fn_calculate_city_health_index('Tallinn') AS active_city_score;


-- Test Scenario 2: Boundary Execution (Valid City with No Reviews - e.g., 'Fier')
-- Expected: Returns the neutral benchmark score of 50.
SELECT public.fn_calculate_city_health_index('Fier') AS baseline_city_score;


-- Test Scenario 3: Exception Interception (Invalid City Name Not in Registry)
-- Expected: Returns 0 as a safe fallback and records a warning message in the 'Messages' tab.
SELECT public.fn_calculate_city_health_index('NonExistentCityXYZ') AS error_fallback_score;