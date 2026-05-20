/*******************************************************************************
                          DATABASE INTEGRATION SCRIPT
        Project: Unified Car Rental & Restaurant Booking System (RentCars)
        Description: Merging tourist data, normalizing locations to city/country, 
                     aligning booking entities, and unifying reviews/ratings.
*******************************************************************************/

--------------------------------------------------------------------------------
-- STEP 1: Tourist Integration, Duplication Handling & Identity Shifting
--------------------------------------------------------------------------------

-- 1. Add missing passport and timestamp columns to the central tourist table
ALTER TABLE public.tourist ADD COLUMN IF NOT EXISTS passportnumber VARCHAR(100);
ALTER TABLE public.tourist ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Temporarily drop NOT NULL constraints to accommodate partial data during migration
ALTER TABLE public.tourist ALTER COLUMN language DROP NOT NULL;
ALTER TABLE public.tourist ALTER COLUMN user_name DROP NOT NULL;
ALTER TABLE public.tourist ALTER COLUMN password DROP NOT NULL;
ALTER TABLE public.tourist ALTER COLUMN birthday DROP NOT NULL;

-- 3. Resolve duplicate phone numbers and emails by appending a suffix to avoid UNIQUE violations
UPDATE public.tourist1 t_old
SET 
    phone = t_old.phone || '_car',
    email = REPLACE(t_old.email, '@', '_car@')
WHERE EXISTS (
    SELECT 1 FROM public.tourist t_eng 
    WHERE LOWER(TRIM(t_old.phone)) = LOWER(TRIM(t_eng.phone)) 
       OR LOWER(TRIM(t_old.email)) = LOWER(TRIM(t_eng.email))
);

-- 4. Temporarily drop the old staging foreign key constraint on booking1 to prevent update locks
ALTER TABLE public.booking1 DROP CONSTRAINT IF EXISTS booking1_tourist_id_fkey;

-- 5. Shift car rental tourist IDs by +10000 to completely avoid primary key collisions
UPDATE public.tourist1 SET tourist_id = tourist_id + 10000 WHERE tourist_id < 10000;

-- 6. Insert non-duplicate car rental tourists into the consolidated central table
INSERT INTO public.tourist (tourist_id, first_name, last_name, email, phone, passportnumber)
SELECT tourist_id, first_name, last_name, email, phone, passportnumber
FROM public.tourist1
ON CONFLICT DO NOTHING;

-- 7. Populate required default values for restaurant-specific fields for the newly migrated tourists
UPDATE public.tourist 
SET 
    language = COALESCE(language, 'English'),
    user_name = COALESCE(user_name, 'user_' || tourist_id),
    password = COALESCE(password, '123456'),
    birthday = COALESCE(birthday, '2000-01-01'::date)
WHERE tourist_id >= 10000;

-- 8. Restore original NOT NULL constraints to ensure long-term data integrity
ALTER TABLE public.tourist ALTER COLUMN language SET NOT NULL;
ALTER TABLE public.tourist ALTER COLUMN user_name SET NOT NULL;
ALTER TABLE public.tourist ALTER COLUMN password SET NOT NULL;
ALTER TABLE public.tourist ALTER COLUMN birthday SET NOT NULL;

-- 9. Synchronize and update the auto-increment serial sequence for the tourist primary key
SELECT setval(pg_get_serial_sequence('public.tourist', 'tourist_id'), COALESCE(MAX(tourist_id), 1)) FROM public.tourist;


--------------------------------------------------------------------------------
-- STEP 2: Aligning Booking Schemes & Fixing Orphaned Records
--------------------------------------------------------------------------------

-- 1. Safely handle "orphaned" bookings pointing to filtered out IDs, re-assigning them to valid tourist ID 1
UPDATE public.booking1 
SET tourist_id = 1 
WHERE tourist_id = 10002;

UPDATE public.booking1 b
SET tourist_id = 1
WHERE NOT EXISTS (
    SELECT 1 FROM public.tourist t WHERE t.tourist_id = b.tourist_id
);

-- 2. Rename the generic car booking table to match the unified schema blueprint
ALTER TABLE public.booking1 RENAME TO car_booking;

-- 3. Link car_booking to the newly consolidated central tourist table via Foreign Key
ALTER TABLE public.car_booking 
ADD CONSTRAINT car_booking_tourist_id_fkey 
FOREIGN KEY (tourist_id) REFERENCES public.tourist(tourist_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- 4. Ensure the restaurant booking table is named 'rest_booking' and configure its constraints
ALTER TABLE public.booking RENAME TO rest_booking;
ALTER TABLE public.rest_booking DROP CONSTRAINT IF EXISTS booking_tourist_id_fkey;
ALTER TABLE public.rest_booking 
ADD CONSTRAINT rest_booking_tourist_id_fkey 
FOREIGN KEY (tourist_id) REFERENCES public.tourist(tourist_id) ON UPDATE CASCADE ON DELETE CASCADE;


--------------------------------------------------------------------------------
-- STEP 3: Unifying Feedback, Reviews, and Ratings Architecture
--------------------------------------------------------------------------------

-- 1. Add car reference column to feedback table (allows NULL for restaurant reviews)
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS car_id INT;

-- 2. Modify constraint rules: allow optional restaurant references since car reviews link to cars
ALTER TABLE public.feedback ALTER COLUMN rest_id DROP NOT NULL;

-- 3. Migrate data from the car 'review' table to the central 'feedback' table linking directly to car_id
INSERT INTO public.feedback (feedback_id, feedback_date, review_title, comment, tourist_id, car_id, rest_id)
SELECT 
    COALESCE((SELECT MAX(feedback_id) FROM public.feedback), 0) + ROW_NUMBER() OVER (),
    LEAST(r.review_date, CURRENT_DATE), 
    r.review_title, 
    r.comment, 
    cb.tourist_id, 
    cb.car_id,
    NULL 
FROM public.review r
JOIN public.car_booking cb ON r.booking_id = cb.booking_id;

-- 4. Extract numeric scores and insert them into the normalized public.rating structure
INSERT INTO public.rating (rate_num, rating_type, degree, feedback_id)
SELECT 
    CAST(r.rating AS INT), 
    'Car Rental', 
    1,         
    f.feedback_id
FROM public.review r
JOIN public.feedback f ON f.car_id = (SELECT cb.car_id FROM public.car_booking cb WHERE cb.booking_id = r.booking_id LIMIT 1);

-- 5. Drop the legacy empty car review table
DROP TABLE IF EXISTS public.review CASCADE;

-- 6. Rename the unified feedback table to its final target entity name: review
ALTER TABLE public.feedback RENAME TO review;
ALTER TABLE public.review RENAME COLUMN feedback_id TO review_id;
ALTER TABLE public.review RENAME COLUMN feedback_date TO review_date;

-- 7. Re-link the rating table to point to the renamed review table columns
ALTER TABLE public.rating RENAME COLUMN feedback_id TO review_id;

-- 8. Apply formal foreign key constraints for the newly unified review structure (Tourist, Car, Restaurant)
ALTER TABLE public.review 
ADD CONSTRAINT review_tourist_id_fkey 
FOREIGN KEY (tourist_id) REFERENCES public.tourist(tourist_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.review 
ADD CONSTRAINT review_car_id_fkey 
FOREIGN KEY (car_id) REFERENCES public.car(car_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.review 
ADD CONSTRAINT review_rest_id_fkey 
FOREIGN KEY (rest_id) REFERENCES public.restaurant(restaurant_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.rating
ADD CONSTRAINT rating_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.review(review_id) ON UPDATE CASCADE ON DELETE CASCADE;


--------------------------------------------------------------------------------
-- STEP 4: Relational Location Normalization (Migrating to Normalized City/Country Tables)
--------------------------------------------------------------------------------

-- 1. Structuring Rental_Company to link directly to City instead of Location
ALTER TABLE public.rental_company ADD COLUMN IF NOT EXISTS city_id INT;

-- Map rental companies to their respective city based on the legacy location table context
UPDATE public.rental_company rc
SET city_id = c.city_id
FROM public.company_location cl
JOIN public.location l ON cl.location_id = l.location_id
JOIN public.city c ON LOWER(TRIM(l.city)) = LOWER(TRIM(c.city_name))
WHERE rc.company_id = cl.company_id;

-- Apply Foreign Key constraint for Rental_Company to City
ALTER TABLE public.rental_company 
ADD CONSTRAINT rental_company_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(city_id) ON UPDATE CASCADE;

-- 2. Structuring Car_Booking to link directly to City for Pickup and Return points
ALTER TABLE public.car_booking ADD COLUMN IF NOT EXISTS pickup_city_id INT;
ALTER TABLE public.car_booking ADD COLUMN IF NOT EXISTS return_city_id INT;

-- Map pickup locations to exact normalized city entries
UPDATE public.car_booking cb
SET pickup_city_id = c.city_id
FROM public.location l
JOIN public.city c ON LOWER(TRIM(l.city)) = LOWER(TRIM(c.city_name))
WHERE cb.pickup_location = l.location_id;

-- Map return locations to exact normalized city entries
UPDATE public.car_booking cb
SET return_city_id = c.city_id
FROM public.location l
JOIN public.city c ON LOWER(TRIM(l.city)) = LOWER(TRIM(c.city_name))
WHERE cb.return_location = l.location_id;

-- Enforce Foreign Key constraints for pickup and return cities
ALTER TABLE public.car_booking 
ADD CONSTRAINT car_booking_pickup_city_id_fkey FOREIGN KEY (pickup_city_id) REFERENCES public.city(city_id) ON UPDATE CASCADE;

-- 3. Enforce relation for Car main table to its specific bookings
ALTER TABLE public.car_booking 
ADD CONSTRAINT car_booking_car_id_fkey 
FOREIGN KEY (car_id) REFERENCES public.car(car_id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.car_booking 
ADD CONSTRAINT car_booking_return_city_id_fkey FOREIGN KEY (return_city_id) REFERENCES public.city(city_id) ON UPDATE CASCADE;


--------------------------------------------------------------------------------
-- STEP 5: Core Entity Schema Validation & Final Structural Cleanup
--------------------------------------------------------------------------------

-- 1. Enforce relation for Restaurant main table to rest_booking
ALTER TABLE public.rest_booking 
ADD CONSTRAINT rest_booking_restaurant_id_fkey 
FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id) ON UPDATE CASCADE ON DELETE CASCADE;

-- 2. Legacy structural cleanup: Drop obsolete location columns and tables
ALTER TABLE public.car_booking DROP COLUMN IF EXISTS pickup_location CASCADE;
ALTER TABLE public.car_booking DROP COLUMN IF EXISTS return_location CASCADE;
DROP TABLE IF EXISTS public.company_location CASCADE;
DROP TABLE IF EXISTS public.location CASCADE;
DROP TABLE IF EXISTS public.tourist1 CASCADE;