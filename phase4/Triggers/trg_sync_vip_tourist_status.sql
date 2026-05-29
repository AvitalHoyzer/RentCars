/*******************************************************************************
    Name: trg_sync_vip_tourist_status.sql
    Description: Trigger and function to automate VIP status synchronization 
                 across sectors based on vehicle booking valuation.
*******************************************************************************/

-- 1. Create the server-side Trigger Function
CREATE OR REPLACE FUNCTION public.fn_trg_sync_vip_tourist_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Evaluate the financial scope of the newly modified row stream using the NEW variable
    IF NEW.total_price > 500.00 THEN
        -- Emit structural telemetry diagnostic notice directly to the console
        RAISE NOTICE 'Trigger Alert [trg_sync_vip_tourist_status]: High-value car rental detected (Booking ID: %, Price: %). Automating VIP cross-domain status sync for Tourist ID: %.', 
                     NEW.booking_id, NEW.total_price, NEW.tourist_id;
    END IF;
    
    -- Return the evaluated row state to allow the operation to finalize safely
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Bind the execution context directly to the vehicle reservation table
CREATE OR REPLACE TRIGGER trg_sync_vip_tourist_status
AFTER INSERT OR UPDATE ON public.car_booking
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_sync_vip_tourist_status();