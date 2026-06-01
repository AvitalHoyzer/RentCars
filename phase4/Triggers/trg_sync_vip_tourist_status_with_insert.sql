/*******************************************************************************
    Name: trg_sync_vip_tourist_status_with_insert.sql
    Description: Trigger and function to automate VIP status synchronization 
                 across sectors based on vehicle booking valuation.
*******************************************************************************/

-- 1. Create the server-side Trigger Function
CREATE OR REPLACE FUNCTION public.fn_trg_sync_vip_tourist_status_with_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Evaluate the financial scope of the newly modified row stream using the NEW variable
    IF NEW.total_price > 500.00 THEN
        INSERT INTO public.VIP_TOURIST(tourist_id)
        VALUES(NEW.tourist_id);
    END IF;
    
    -- Return the evaluated row state to allow the operation to finalize safely
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Bind the execution context directly to the vehicle reservation table
CREATE OR REPLACE TRIGGER trg_sync_vip_tourist_status_with_insert
AFTER INSERT ON public.car_booking
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_sync_vip_tourist_status_with_insert();