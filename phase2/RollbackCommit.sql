--Rollback---

-- 1. Start a transaction
BEGIN;

-- 2. Show state BEFORE update (to compare later)
SELECT brand, model, price_per_day FROM CAR WHERE car_type = 'SUV';

-- 3. Perform an update: double the price of luxury cars
UPDATE CAR SET price_per_day = price_per_day * 2 WHERE car_type = 'SUV';

-- 4. Show state AFTER update (within the transaction)
SELECT brand, model, price_per_day FROM CAR WHERE car_type = 'SUV';

-- 5. Oops, that was a mistake! Rollback the changes.
ROLLBACK;

-- 6. Show state AFTER rollback: the prices are back to normal
SELECT brand, model, price_per_day FROM CAR WHERE car_type = 'SUV';


---Commit---

-- 1. Start a transaction
BEGIN;

-- 2. Show state BEFORE update
SELECT car_id, status FROM CAR WHERE car_id = 1;

-- 3. Perform an update: set car status to 'Maintenance'
UPDATE CAR SET status = 'Maintenance' WHERE car_id = 1;

-- 4. Show state AFTER update
SELECT car_id, status FROM CAR WHERE car_id = 1;

-- 5. Everything looks correct. Commit the changes permanently.
COMMIT;

-- 6. Show state AFTER commit: the status remains 'Maintenance'
SELECT car_id, status FROM CAR WHERE car_id = 1;