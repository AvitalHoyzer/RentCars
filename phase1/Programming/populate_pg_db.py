import psycopg2
from psycopg2.extras import execute_batch
import random
from datetime import datetime, timedelta
import uuid

# Database connection settings. Adjust these to match your local PostgreSQL configuration.
DB_PARAMS = {
    "host": "localhost",
    "port": "5432",
    "database": "rentcarsDB",  
    "user": "avital",      
    "password": "moriya"   
}

def get_random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randrange(delta.days)
    return start_date + timedelta(days=random_days)

def populate_db():
    print("Connecting to the database...")
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        print("Please ensure your connection settings (DB_PARAMS) are correct and the server is running.")
        return

    # To avoid UniqueViolation errors if manual data was inserted in pgAdmin, we automatically
    # advance the Postgres sequences for each table's id (SERIAL) to start securely above the current highest ID.
    tables_pks = [
        ("rental_company", "company_id"),
        ("location", "location_id"),
        ("tourist", "tourist_id"),
        ("car", "car_id"),
        ("booking", "booking_id"),
        ("review", "review_id")
    ]
    try:
        print("Fixing database sequences (if manual data exists)...")
        for table, pk in tables_pks:
            cur.execute(f"SELECT MAX({pk}) FROM {table};")
            max_val = cur.fetchone()[0]
            if max_val is not None:
                cur.execute(f"SELECT setval(pg_get_serial_sequence('{table}', '{pk}'), {max_val});")
        conn.commit()
    except Exception as e:
        print(f"Notice during sequence mapping: {e}")
        conn.rollback()

    print("Generating RENTAL_COMPANY data (500 rows)...")
    companies = []
    # Generate 500 rental companies with semi-random, unique properties
    for i in range(1, 501):
        companies.append((
            f"Company {i}",
            f"+97250{random.randint(1000000, 9999999)}",
            f"contact_{i}_{uuid.uuid4().hex[:6]}@mail.com" 
        ))
    execute_batch(cur, """
        INSERT INTO RENTAL_COMPANY (company_name, phone, email) 
        VALUES (%s, %s, %s)
    """, companies)
    conn.commit()
    
    cur.execute("SELECT company_id FROM RENTAL_COMPANY;")
    company_ids = [row[0] for row in cur.fetchall()]

    print("Generating LOCATION data (500 rows)...")
    locations = []
    # Create 500 distinct physical locations simulating global branches
    cities = ["Tel Aviv", "Jerusalem", "Haifa", "Eilat", "Paris", "London", "New York", "Tokyo", "Berlin", "Rome"]
    for i in range(1, 501):
        locations.append((
            random.choice(cities),
            f"{random.randint(1, 200)} Main St",
            "Israel" if i % 2 == 0 else "Country",
            round(random.uniform(-90.0, 90.0), 4),
            round(random.uniform(-180.0, 180.0), 4)
        ))
    execute_batch(cur, """
        INSERT INTO LOCATION (city, address, country, latitude, longitude) 
        VALUES (%s, %s, %s, %s, %s)
    """, locations)
    conn.commit()

    cur.execute("SELECT location_id FROM LOCATION;")
    location_ids = [row[0] for row in cur.fetchall()]

    print("Generating COMPANY_LOCATION data...")
    comp_locs = set()
    # Assign exactly 2 random locations to each dynamically generated company
    for cid in company_ids:
        locs = random.sample(location_ids, 2)
        for lid in locs:
            comp_locs.add((cid, lid))
    execute_batch(cur, """
        INSERT INTO COMPANY_LOCATION (company_id, location_id) 
        VALUES (%s, %s) ON CONFLICT DO NOTHING
    """, list(comp_locs))
    conn.commit()

    print("Generating TOURIST data (1000 rows)...")
    tourists = []
    for i in range(1, 1001):
        tourists.append((
            f"FirstName {i}",
            f"LastName {i}",
            f"tourist_{i}_{uuid.uuid4().hex[:6]}@mail.com", # UNIQUE + @
            f"+12345{random.randint(100000, 999999)}",
            "CountryName",
            f"PASS{i}{uuid.uuid4().hex[:4]}" # UNIQUE
        ))
    # Execute batch insert for tourists to maintain high insertion performance
    execute_batch(cur, """
        INSERT INTO TOURIST (first_name, last_name, email, phone, country, passportNumber) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """, tourists)
    conn.commit()

    cur.execute("SELECT tourist_id FROM TOURIST;")
    tourist_ids = [row[0] for row in cur.fetchall()]

    print("Generating CAR data (20,000 rows)...")
    cars = []
    brands = ["Toyota", "Hyundai", "Kia", "Mazda", "Skoda", "Ford", "Honda", "Chevrolet"]
    types = ["Sedan", "SUV", "Hatchback", "Mini"]
    statuses = ["Available", "Rented", "Maintenance"]
    transmissions = ["Manual", "Auto"]
    
    current_year = datetime.now().year
    
    for i in range(1, 20001):
        # Generate 20,000 cars while strictly adhering to SQL constraints (CHECK clauses)
        cars.append((
            random.choice(brands),
            f"Model {random.randint(1, 15)}",
            random.randint(2000, current_year), # CHECK year
            random.choice(types),
            random.randint(2, 9), # CHECK seats 2-9
            random.choice(transmissions), # CHECK
            random.randint(200, 600),
            round(random.uniform(50.0, 500.0), 2), # price > 0
            random.choice(statuses), # CHECK
            "Bluetooth, Camera",
            random.choice(company_ids)
        ))
    execute_batch(cur, """
        INSERT INTO CAR (brand, model, year, car_type, seats_number, transmission_type, trunk_capacity, price_per_day, status, car_features, company_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, cars)
    conn.commit()

    cur.execute("SELECT car_id FROM CAR;")
    car_ids = [row[0] for row in cur.fetchall()]

    print("Generating BOOKING data (20,000 rows)...")
    bookings = []
    book_statuses = ["Booked", "Active", "Completed", "Cancelled"]
    current_date = datetime.now().date()
    
    for i in range(1, 20001):
        # Strictly obey constraints: booking_date <= pickup_date <= return_date
        # Ensure dates correctly flow logically over time
        booking_d = current_date - timedelta(days=random.randint(10, 300))
        pickup_d = booking_d + timedelta(days=random.randint(0, 30))
        return_d = pickup_d + timedelta(days=random.randint(0, 14))
        
        bookings.append((
            pickup_d,
            return_d,
            booking_d,
            round(random.uniform(50.0, 3000.0), 2), # price > 0
            random.choice(book_statuses),
            random.choice(car_ids),
            random.choice(tourist_ids),
            random.choice(location_ids),
            random.choice(location_ids)
        ))
    execute_batch(cur, """
        INSERT INTO BOOKING (pickup_date, return_date, booking_date, total_price, status, car_id, tourist_id, pickup_location, return_location)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, bookings)
    conn.commit()

    cur.execute("SELECT booking_id FROM BOOKING;")
    booking_ids = [row[0] for row in cur.fetchall()]

    print("Generating REVIEW data (500 rows)...")
    
    # 1. Find which booking_ids already exist in the REVIEW table to avoid uniqueness constraint violation
    cur.execute("SELECT booking_id FROM REVIEW;")
    existing_review_ids = {row[0] for row in cur.fetchall()}
    
    # 2. Extract only the IDs of bookings that do not have a review yet
    available_booking_ids = [bid for bid in booking_ids if bid not in existing_review_ids]
    
    # 3. Randomly sample 500 available bookings (or fewer if there aren't 500 available)
    num_to_sample = min(500, len(available_booking_ids))
    selected_bookings = random.sample(available_booking_ids, num_to_sample)
    
    reviews = []
    for bid in selected_bookings:
        reviews.append((
            random.randint(1, 5), # CHECK 1-5
            "Great experience!",
            current_date - timedelta(days=random.randint(1, 100)),
            "Review Title",
            bid
        ))
    
    if reviews:
        execute_batch(cur, """
            INSERT INTO REVIEW (rating, comment, review_date, review_title, booking_id)
            VALUES (%s, %s, %s, %s, %s)
        """, reviews)
        conn.commit()

    cur.close()
    conn.close()
    print("Data successfully inserted into the database!")

if __name__ == "__main__":
    populate_db()
