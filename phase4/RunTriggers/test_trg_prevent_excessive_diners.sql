/*******************************************************************************
    Name: test_trg_prevent_excessive_diners.sql
    Description: Exception interception verification script for capacity constraints.
*******************************************************************************/

-- Execution Scenario: Attempt to inject a reservation violating capacity bounds
-- Target Volume: 30 diners (exceeding the strict system safety ceiling of 20)
-- Expected Result: The BEFORE INSERT trigger intercepts the operational stream,
-- blocks data modification, throws a custom exception, and rolls back execution.

INSERT INTO public.rest_booking (booking_id, booking_date, num_of_people, status, tourist_id, rest_id)
VALUES (
    9999,               -- Isolated manual test primary key
    '2026-07-05'::DATE, -- Target reservation date
    30,                 -- Deliberate business logic violation (greater than 20)
    'Active',           -- Hardcoded valid schema status descriptor
    1,                  -- Valid testing Tourist ID
    1                   -- Valid testing Restaurant ID
);