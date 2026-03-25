CREATE TABLE RENTAL_COMPANY
(
  company_id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL UNIQUE,
  
  CHECK (email LIKE '%@%')
);

CREATE TABLE CAR
(
  car_id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  car_type TEXT NOT NULL,
  seats_number INTEGER NOT NULL,
  transmission_type TEXT NOT NULL,
  trunk_capacity INTEGER,
  price_per_day NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  car_features TEXT,
  company_id INTEGER NOT NULL,
  
  FOREIGN KEY (company_id) REFERENCES RENTAL_COMPANY(company_id),

  CHECK (price_per_day > 0),
  CHECK (seats_number BETWEEN 2 AND 9),
  CHECK (year BETWEEN 2000 AND EXTRACT(YEAR FROM CURRENT_DATE)),
  CHECK (status IN ('Available','Rented','Maintenance')),
  CHECK (transmission_type IN ('Manual','Auto'))
);

CREATE TABLE TOURIST
(
  tourist_id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT NOT NULL,
  passportNumber TEXT NOT NULL UNIQUE,

  CHECK (email LIKE '%@%')
);

CREATE TABLE LOCATION
(
  location_id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  address TEXT,
  country TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,

  CHECK (latitude BETWEEN -90 AND 90),
  CHECK (longitude BETWEEN -180 AND 180)
);

CREATE TABLE BOOKING
(
  booking_id SERIAL PRIMARY KEY,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  booking_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  
  car_id INTEGER NOT NULL,
  tourist_id INTEGER NOT NULL,
  pickup_location INTEGER NOT NULL,
  return_location INTEGER NOT NULL,

  FOREIGN KEY (car_id) REFERENCES CAR(car_id),
  FOREIGN KEY (tourist_id) REFERENCES TOURIST(tourist_id),
  FOREIGN KEY (pickup_location) REFERENCES LOCATION(location_id),
  FOREIGN KEY (return_location) REFERENCES LOCATION(location_id),

  CHECK (return_date >= pickup_date),
  CHECK (booking_date <= pickup_date),
  CHECK (total_price > 0),
  CHECK (status IN ('Booked','Active','Completed','Cancelled'))
);

CREATE TABLE REVIEW
(
  review_id SERIAL PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  review_date DATE NOT NULL,
  review_title TEXT NOT NULL,
  booking_id INTEGER NOT NULL UNIQUE,

  FOREIGN KEY (booking_id) REFERENCES BOOKING(booking_id)
);

CREATE TABLE COMPANY_LOCATION
(
  company_id INTEGER NOT NULL,
  location_id INTEGER NOT NULL,
  PRIMARY KEY (company_id, location_id),

  FOREIGN KEY (company_id) REFERENCES RENTAL_COMPANY(company_id),
  FOREIGN KEY (location_id) REFERENCES LOCATION(location_id)
);