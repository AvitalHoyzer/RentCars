/*******************************************************************************
    Name: trg_prevent_excessive_diners.sql
    Description: Defensive trigger and function to enforce system capacity limits.
*******************************************************************************/

-- 1. Create the gatekeeper Trigger Function
CREATE OR REPLACE FUNCTION public.fn_trg_prevent_excessive_diners()
RETURNS TRIGGER AS $$
BEGIN
    -- Monitor operational input values by intercepting the incoming NEW record modifier
    IF NEW.num_of_people > 20 THEN
        -- Force a structural database exception to intercept and cancel the transaction block
        RAISE EXCEPTION 'Security Block [trg_prevent_excessive_diners]: Booking rejected. A single restaurant reservation cannot exceed 20 diners (Attempted: % people).', 
                        NEW.num_of_people;
    END IF;
    
    -- Pass valid records forward for safe transactional commit
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Bind the validation gateway to the restaurant registration table
CREATE OR REPLACE TRIGGER trg_prevent_excessive_diners
BEFORE INSERT OR UPDATE ON public.rest_booking
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_prevent_excessive_diners();