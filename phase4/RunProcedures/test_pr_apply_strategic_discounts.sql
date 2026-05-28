/*******************************************************************************
                     Verification for pr_apply_strategic_discounts
*******************************************************************************/

-- Test Scenario: Execute the batch DML process and observe results in 'Messages'
-- Expected: The script loops through companies, evaluates their cities,
-- and dynamically reduces car prices for companies in weaker zones.
CALL public.pr_apply_strategic_discounts();