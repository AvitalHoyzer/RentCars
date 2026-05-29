/*******************************************************************************
    Name: test_trg_sync_vip_tourist_status.sql
    Description: Validation and verification script for the VIP status trigger.
*******************************************************************************/

-- Execution Scenario: Inject a high-value vehicle reservation record
-- Expected Result: The transaction triggers an immediate response, posting 
-- a custom confirmation string to the pgAdmin 'Messages' console channel.
INSERT INTO public.car_booking (booking_id, booking_date, pickup_date, return_date, total_price, status, tourist_id, car_id, pickup_city_id, return_city_id)
VALUES (
    (SELECT COALESCE(MAX(booking_id), 0) + 1 FROM public.car_booking), 
    CURRENT_DATE, 
    '2026-07-01'::DATE, 
    '2026-07-10'::DATE, 
    1200.00, -- High-value amount configured to exceed the $500 threshold marker
    (SELECT status FROM public.car_booking WHERE status IS NOT NULL LIMIT 1), 
    1, 1, 1, 1
);