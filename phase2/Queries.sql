----- Select Queries -----

-- Query 1: Find available cars in Jerusalem
-- GUI: Shows search results for the main page.

-- Option A: Using JOIN (Better for retrieving company details)
SELECT c.brand, c.model, rc.company_name, c.price_per_day
FROM CAR c
JOIN RENTAL_COMPANY rc ON c.company_id = rc.company_id
JOIN COMPANY_LOCATION cl ON rc.company_id = cl.company_id
JOIN LOCATION l ON cl.location_id = l.location_id
WHERE l.city = 'Jerusalem' AND c.status = 'Available';

-- Option B: Using EXISTS (Often faster for large datasets)
SELECT c.brand, c.model, c.price_per_day
FROM CAR c
WHERE c.status = 'Available' AND EXISTS (
    SELECT 1 FROM COMPANY_LOCATION cl
    JOIN LOCATION l ON cl.location_id = l.location_id
    WHERE cl.company_id = c.company_id AND l.city = 'Jerusalem'
);

/* Efficiency Note:
JOIN is standard and good for displaying extra info. 
EXISTS is more efficient for "existence" checks because it stops 
at the first match (Short-circuit).
*/

-- Query 2: Tourists with more than five booking in 2026
-- GUI: Used for customer management and loyalty programs.

-- Option A: Using JOIN and HAVING
SELECT t.first_name, t.last_name, COUNT(b.booking_id) as total_bookings
FROM TOURIST t
JOIN BOOKING b ON t.tourist_id = b.tourist_id
WHERE EXTRACT(YEAR FROM b.booking_date) = 2026
GROUP BY t.tourist_id, t.first_name, t.last_name
HAVING COUNT(b.booking_id) > 5;

-- Option B: Using IN with Subquery
SELECT first_name, last_name 
FROM TOURIST 
WHERE tourist_id IN (
    SELECT tourist_id FROM BOOKING 
    WHERE EXTRACT(YEAR FROM booking_date) = 2026
    GROUP BY tourist_id 
    HAVING COUNT(*) > 5
);

/* Efficiency Note:
JOIN is better if you need to display the count (total_bookings) in the GUI.
IN is efficient when you only need the names, as the database engine 
can optimize the internal list lookup.
*/

-- Query 3: Popular cars with high ratings (4+)
-- GUI: Populates the "Recommended Cars" or "Top Rated" section.

-- Option A: Using Double JOIN and HAVING
SELECT c.brand, c.model, AVG(r.rating) as avg_rating
FROM CAR c
JOIN BOOKING b ON c.car_id = b.car_id
JOIN REVIEW r ON b.booking_id = r.booking_id
GROUP BY c.car_id, c.brand, c.model
HAVING AVG(r.rating) >= 4;

-- Option B: Using Subquery in the FROM clause
SELECT c.brand, c.model, ratings.avg_r
FROM CAR c
JOIN (
    SELECT b.car_id, AVG(r.rating) as avg_r
    FROM BOOKING b
    JOIN REVIEW r ON b.booking_id = r.booking_id
    GROUP BY b.car_id
) ratings ON c.car_id = ratings.car_id
WHERE ratings.avg_r >= 4;

/* Efficiency Note:
Option A is more straightforward for the SQL optimizer. 
Option B (Subquery) can be more efficient if the subquery significantly 
reduces the number of rows before joining with the CAR table.
*/

-- Query 4: Top 3 most booked cars in 2026
-- GUI: Shows "Popular Choices" on the homepage.

-- Option A: Using JOIN and GROUP BY
SELECT c.brand, c.model, COUNT(b.booking_id) as reservation_count
FROM CAR c
JOIN BOOKING b ON c.car_id = b.car_id
WHERE EXTRACT(YEAR FROM b.booking_date) = 2026
GROUP BY c.car_id, c.brand, c.model
ORDER BY reservation_count DESC
LIMIT 3;

-- Option B: Using Subquery in FROM (Pre-calculating counts)
SELECT c.brand, c.model, res.total
FROM CAR c
JOIN (
    SELECT car_id, COUNT(*) as total 
    FROM BOOKING 
    WHERE EXTRACT(YEAR FROM booking_date) = 2026
    GROUP BY car_id
) res ON c.car_id = res.car_id
ORDER BY res.total DESC 
LIMIT 3;

/* Efficiency Note: 
Option B can be faster if the BOOKING table is huge, as it aggregates 
data before performing the JOIN with the CAR table. */


-- Query 5: Detailed booking history for a specific tourist
-- GUI: Populates the "My Bookings" screen for a user (e.g., tourist_id = 1).
-- Uses LEFT JOIN to show bookings even if the user hasn't left a review yet.

SELECT 
    b.booking_id, 
    c.brand, 
    c.model, 
    b.pickup_date, 
    b.return_date, 
    r.rating
FROM BOOKING b
JOIN CAR c ON b.car_id = c.car_id
LEFT JOIN REVIEW r ON b.booking_id = r.booking_id
WHERE b.tourist_id = 1
ORDER BY b.pickup_date DESC;


-- Query 6: Monthly revenue report for 2026
-- GUI: Used in the Admin Dashboard to track business performance.
-- Demonstrates date manipulation (EXTRACT, TO_CHAR).

SELECT 
    EXTRACT(MONTH FROM pickup_date) as month_num,
    TO_CHAR(pickup_date, 'Month') as month_name,
    COUNT(*) as num_rentals,
    SUM(total_price) as monthly_revenue
FROM BOOKING
WHERE status = 'Completed' AND EXTRACT(YEAR FROM pickup_date) = 2026
GROUP BY month_num, month_name
ORDER BY month_num;


-- Query 7: Top 3 most popular pickup locations
-- GUI: Used for marketing or fleet management to know where demand is highest.

SELECT 
    l.city, 
    l.country, 
    COUNT(b.booking_id) as total_rentals
FROM LOCATION l
JOIN BOOKING b ON l.location_id = b.pickup_location
GROUP BY l.city, l.country
ORDER BY total_rentals DESC
LIMIT 3;


-- Query 8: Most recommended rental company (Highest average rating)
-- GUI: Displays a "Top Rated Company" badge or highlight.
SELECT rc.company_name, AVG(r.rating) as avg_rating, COUNT(r.review_id) as review_count
FROM RENTAL_COMPANY rc
JOIN CAR c ON rc.company_id = c.company_id
JOIN BOOKING b ON c.car_id = b.car_id
JOIN REVIEW r ON b.booking_id = r.booking_id
GROUP BY rc.company_id, rc.company_name
HAVING COUNT(r.review_id) >= 2 
ORDER BY avg_rating DESC
LIMIT 1;


-- Query 9: Budget-friendly cars (Price <= 70) with location details
-- GUI: Filters cars for price-sensitive users.
SELECT c.brand, c.model, c.price_per_day, rc.company_name, l.city
FROM CAR c
JOIN RENTAL_COMPANY rc ON c.company_id = rc.company_id
JOIN COMPANY_LOCATION cl ON rc.company_id = cl.company_id
JOIN LOCATION l ON cl.location_id = l.location_id
WHERE c.price_per_day <= 70
ORDER BY c.price_per_day ASC;


----- Update Queries -----

-- Query 1: Seasonal price update
-- GUI: Admin tool to increase prices for high-demand categories (SUV).
UPDATE CAR 
SET price_per_day = price_per_day * 1.10 
WHERE car_type = 'SUV';

-- Query 2: Auto-cancel expired bookings
-- GUI: Background system task to clean up old 'Booked' orders that never started.
UPDATE BOOKING 
SET status = 'Cancelled' 
WHERE status = 'Booked' AND pickup_date < CURRENT_DATE;

-- Query 3: Update company contact information
-- GUI: Admin profile management for rental companies.
UPDATE RENTAL_COMPANY 
SET phone = '+972-555-0000' 
WHERE company_name = 'Hertz';


----- Delete Queries -----

-- Query 1: Remove low-quality reviews
-- GUI: Data maintenance to remove 1-star reviews that lack comments.
DELETE FROM REVIEW 
WHERE rating = 1 AND comment IS NULL;

-- Query 2: Decommission old vehicles
-- GUI: Fleet management to remove cars from 2002 or older (if not currently rented).
DELETE FROM CAR 
WHERE year < 2003 
  AND status != 'Rented'
  AND car_id NOT IN (SELECT DISTINCT car_id FROM BOOKING);

-- Query 3: Remove inactive locations
-- GUI: Database cleanup for locations that don't have any associated rental branches.
DELETE FROM LOCATION 
WHERE location_id NOT IN (SELECT location_id FROM COMPANY_LOCATION)
  AND location_id NOT IN (SELECT pickup_location FROM BOOKING WHERE pickup_location IS NOT NULL)
  AND location_id NOT IN (SELECT return_location FROM BOOKING WHERE return_location IS NOT NULL);
