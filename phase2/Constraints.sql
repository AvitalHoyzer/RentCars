-- 1. Tourist Phone Length Constraint
-- Motivation: Ensures the phone number is at least 7 digits to prevent partial entries.
-- GUI: Validates user input during the registration process.
ALTER TABLE TOURIST
ADD CONSTRAINT chk_phone_length 
CHECK (LENGTH(phone) >= 7);


-- 2. Tourist Email Format Constraint
-- Motivation: Ensures the email contains a dot (.), enforcing a more realistic format.
-- GUI: Prevents users from entering invalid email addresses like 'name@gmail'.
ALTER TABLE TOURIST
ADD CONSTRAINT chk_email_dot 
CHECK (email LIKE '%.%');


-- 3. Minimum Car Price Threshold
-- Motivation: Business logic to ensure the daily rental price is at least 50.
-- This prevents data entry errors that could lead to financial loss.
ALTER TABLE CAR
ADD CONSTRAINT chk_min_price_threshold 
CHECK (price_per_day >= 50);

