/*******************************************************************************
                                   Views.sql
        Description: Analytical and operational views for the unified system
*******************************************************************************/

--------------------------------------------------------------------------------
-- VIEW 1: Car Rental Operations View (Car Domain Perspective)
-- Description: Combines car bookings, cars, and customer details to give 
-- a complete operational summary of active car rentals and revenue.
--------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_car_rental_summary AS
SELECT 
    cb.booking_id,
    t.tourist_id,
    t.first_name || ' ' || t.last_name AS customer_name,
    c.brand || ' ' || c.model AS car_details,
    cb.pickup_date,
    cb.return_date,
    cb.total_price,
    city.city_name AS pickup_location_city
FROM public.car_booking cb
JOIN public.tourist t ON cb.tourist_id = t.tourist_id
JOIN public.car c ON cb.car_id = c.car_id
JOIN public.city city ON cb.pickup_city_id = city.city_id;

--------------------------------------------------------------------------------
-- VIEW 2: Restaurant Booking Analytics View (Restaurant Domain Perspective)
-- Description: Combines restaurant bookings, restaurant specs, location, 
-- and tourist data to analyze dining traffic and restaurant popularity.
--------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_restaurant_booking_summary AS
SELECT 
    rb.booking_id,
    r.rest_name,
    r.cuisine_type,
    city.city_name AS restaurant_city,
    rb.booking_date,
    rb.num_of_people,
    t.first_name || ' ' || t.last_name AS customer_name
FROM public.rest_booking rb
JOIN public.restaurant r ON rb.rest_id = r.rest_id
JOIN public.tourist t ON rb.tourist_id = t.tourist_id
JOIN public.city city ON r.city_id = city.city_id;

--------------------------------------------------------------------------------
-- VIEW 3: Cross-Domain Customer Feedback & Rating View (Unified Core)
-- Description: Integrates the unified review and rating system, linking 
-- metrics across both car and restaurant domains to monitor customer satisfaction.
--------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_unified_customer_feedback AS
SELECT 
    r.review_id,
    t.first_name || ' ' || t.last_name AS customer_name,
    r.review_title,
    r.comment,
    rat.rate_num AS rating_score,
    rat.rating_type,
    COALESCE(car.brand || ' (Car)', rest.rest_name || ' (Restaurant)') AS reviewed_item
FROM public.review r
JOIN public.tourist t ON r.tourist_id = t.tourist_id
JOIN public.rating rat ON r.review_id = rat.review_id
LEFT JOIN public.car car ON r.car_id = car.car_id
LEFT JOIN public.restaurant rest ON r.rest_id = rest.rest_id;


/*******************************************************************************
                        QUERIES EXECUTION ON THE VIEWS
*******************************************************************************/

--------------------------------------------------------------------------------
-- QUERIES ON VIEW 1: v_car_rental_summary
--------------------------------------------------------------------------------

-- Query 1: Calculate total rentals and total revenue grouped by each pickup city.
-- Description: This query aggregates operational rental data to identify which 
-- geographic locations generate the highest booking traffic and financial revenue.
SELECT pickup_location_city, COUNT(booking_id) AS total_rentals, SUM(total_price) AS total_revenue
FROM public.v_car_rental_summary
GROUP BY pickup_location_city
ORDER BY total_revenue DESC;

-- Query 2: Identify VIP customers with a cumulative car rental spending exceeding 1500.
-- Description: Filters and displays high-value customers based on their aggregate spending 
-- across all their historic car rental bookings, allowing targeted CRM marketing campaigns.
SELECT customer_name, COUNT(booking_id) AS rental_count, SUM(total_price) AS money_spent
FROM public.v_car_rental_summary
GROUP BY customer_name
HAVING SUM(total_price) > 1500
ORDER BY money_spent DESC;


--------------------------------------------------------------------------------
-- QUERIES ON VIEW 2: v_restaurant_booking_summary
--------------------------------------------------------------------------------

-- Query 1: Calculate the average group size and total bookings per cuisine type.
-- Description: Analyzes customer dining preferences by evaluating which cuisine types 
-- attract larger groups and generate higher baseline booking numbers.
SELECT cuisine_type, COUNT(booking_id) AS total_bookings, ROUND(AVG(num_of_people), 2) AS avg_group_size
FROM public.v_restaurant_booking_summary
GROUP BY cuisine_type
ORDER BY avg_group_size DESC;

-- Query 2: Weekly traffic analysis calculating total bookings and diners per day of the week.
-- Description: Uses date extraction logic to measure dining volumes by day, helping restaurant 
-- administrators identify high-traffic peak days (e.g., weekends) for staff scheduling.
SELECT 
    CASE EXTRACT(ISODOW FROM booking_date)
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
        WHEN 7 THEN 'Sunday'
    END AS day_of_week,
    COUNT(booking_id) AS total_bookings,
    SUM(num_of_people) AS total_diners
FROM public.v_restaurant_booking_summary
GROUP BY EXTRACT(ISODOW FROM booking_date), day_of_week
ORDER BY total_diners DESC;


--------------------------------------------------------------------------------
-- QUERIES ON VIEW 3: v_unified_customer_feedback
--------------------------------------------------------------------------------

-- Query 1: Compare the overall average satisfaction rating between the car and restaurant sectors.
-- Description: Evaluates unified customer satisfaction scores dynamically across domains 
-- to provide high-level management with comparative cross-sector quality metrics.
SELECT 
    CASE WHEN reviewed_item LIKE '%(Car)%' THEN 'Car Domain' ELSE 'Restaurant Domain' END AS business_sector,
    COUNT(review_id) AS review_count,
    ROUND(AVG(rating_score), 2) AS average_score
FROM public.v_unified_customer_feedback
GROUP BY CASE WHEN reviewed_item LIKE '%(Car)%' THEN 'Car Domain' ELSE 'Restaurant Domain' END;

-- Query 2: Retrieve critical negative feedback with a score of 2 or lower for urgent service intervention.
-- Description: Identifies dissatisfied customers and extracts their text feedback, 
-- serving as an operational alert queue for immediate customer support outreach.
SELECT customer_name, reviewed_item, rating_score, comment
FROM public.v_unified_customer_feedback
WHERE rating_score <= 2
ORDER BY rating_score ASC;