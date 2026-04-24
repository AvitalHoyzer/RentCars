-- 1. Index for Sorting by Price (Best for "Price: Low to High" feature)
-- Test Query: SELECT * FROM CAR ORDER BY price_per_day ASC;
CREATE INDEX idx_car_price_sort ON CAR(price_per_day);

-- 2. Index for City searching
-- Test Query: SELECT * FROM LOCATION WHERE city = 'Tel Aviv';
CREATE INDEX idx_location_city_search ON LOCATION(city);

-- 3. Index for Date filtering
-- Test Query: SELECT * FROM BOOKING WHERE pickup_date BETWEEN '2026-01-01' AND '2026-12-31';
CREATE INDEX idx_booking_pickup_idx ON BOOKING(pickup_date);