/*******************************************************************************
                     Verification for pr_book_integrated_package
*******************************************************************************/

-- Test Scenario 1: Normal Execution (Valid Package Parameters)
-- Expected: Both records (Car and Restaurant) will be inserted cleanly.
-- Review the 'Messages' tab to track the progressive confirmation logs.
CALL public.pr_book_integrated_package(
    1,                       -- Valid Tourist ID
    1,                       -- Valid Car ID
    1,                       -- Pickup City ID
    1,                       -- Return City ID
    '2026-06-01'::DATE,      -- Pickup Date
    '2026-06-05'::DATE,      -- Return Date
    1,                       -- Valid Restaurant ID
    '2026-06-03'::DATE,      -- Dining Date
    4                        -- Group size
);


-- Test Scenario 2: Exception Handling (Invalid Chronological Date Logic)
-- Expected: The date check triggers, stops the script, alerts the console, 
-- and guarantees no data corruption or partial insertions occur.
CALL public.pr_book_integrated_package(
    1, 
    1, 
    1, 
    1, 
    '2026-06-10'::DATE, 
    '2026-06-01'::DATE,      -- ERROR: Return date is set BEFORE pickup date!
    1, 
    '2026-06-03'::DATE, 
    2
);