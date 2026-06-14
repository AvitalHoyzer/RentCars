# Rent Cars System  

---
Avital Hoyzer  
Moriya Kalfon

## Table of Contents
- [Phase 1: Design and Build the Database](#phase-1-design-and-build-the-database)  
  - [Introduction](#introduction)  
  - [AI Screens](#ai-screens)  
  - [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram)  
  - [DSD (Data Structure Diagram)](#dsd-data-structure-diagram)   
  - [SQL Scripts](#sql-scripts)  
  - [Data Insertion Methods](#data-insertion-methods)  
  - [Backup & Restore](#backup--restore)  
- [Phase 2: Database Management, Advanced Queries & Performance](#phase-2-database-management-advanced-queries--performance)
  - [Complex SELECT Queries (Double Implementation)](#complex-select-queries-double-implementation)
  - [Additional SELECT Queries](#additional-select-queries)
  - [UPDATE & DELETE Operations](#update--delete-operations)
  - [Constraints (Data Integrity)](#constraints-data-integrity)
  - [Transactions (Commit & Rollback)](#transactions-commit--rollback)
  - [Indexes & Performance Optimization](#indexes--performance-optimization)
- [Phase 3: System Integration & Database Views](#phase-3-system-integration--database-views)
  - [Integration & Design Decisions](#integration--design-decisions)
  - [Integrated ERD & Relational Schema](#integrated-erd--relational-schema)
  - [Architectural Decisions During Integration](#architectural-decisions-during-integration)
  - [Step-by-Step Technical Process & Command Breakdown](#step-by-step-technical-process--command-breakdown)
  - [Database Views](#database-views)
- [Phase 4: Database Programming (PL/pgSQL)](#phase-4-database-programming-plpgsql)
  - [Functions](#functions)
  - [Procedures](#procedures)
  - [Triggers](#triggers)
  - [Main Control Programs (Anonymous Blocks)](#main-control-programs-anonymous-blocks)
- [Phase 5: Full Stack Web Application Integration](#phase-5-full-stack-web-application-integration)
  - [Introduction](#introduction-1)
  - [Architecture & Tools Used](#architecture--tools-used)
  - [How to Run the Application](#how-to-run-the-application)
  - [Application Walkthrough & Screens](#application-walkthrough--screens)

---

# Phase 1: Design and Build the Database  

## Introduction  
The Rent Cars Database is designed to manage a car rental system efficiently.  
It stores and organizes information about rental companies, cars, tourists (customers), bookings, locations, and reviews.

The system allows tracking of car availability, managing bookings, storing customer details, and collecting reviews for completed rentals.

### Purpose of the Database  
This database provides a structured solution for:

- Managing rental companies and their available cars  
- Tracking car details such as type, price, and availability  
- Handling customer (tourist) information  
- Managing bookings including pickup and return locations  
- Storing reviews for completed bookings  
- Supporting multiple locations for rental companies  

### Potential Use Cases  
- Customers can book cars, choose pickup/return locations, and leave reviews  
- Rental companies can manage their fleet and availability  
- System administrators can track bookings and analyze usage  
- The system ensures organized and consistent data storage  

---

## AI Screens  
The system interface was created using AI Studio:

🔗 https://ai.studio/apps/eab85170-5b5d-4cef-99a2-307720ccec58 



---

## ERD (Entity-Relationship Diagram) 
<img width="3744" height="1707" alt="erdplus- ERD" src="https://github.com/user-attachments/assets/d50a9b2a-0b3a-402d-b2d7-1c26c2389b5c" />


## DSD (Data Structure Diagram)  
<img width="3744" height="1707" alt="erdplus - DSD" src="https://github.com/user-attachments/assets/e7f026b4-8136-47bb-a353-24059e539326" />

---



## SQL Scripts  

📜 [Create Tables Script](phase1/scripts/createTables.sql)

📜 [Insert Tables Script](phase1/scripts/insertTables.sql)

📜 [Drop Tables Script](phase1/scripts/dropTables.sql)

📜 [Select All Script](phase1/scripts/selectAll.sql)

---

## Data Insertion Methods  

### 1. Python Data Insertion Script
📜[Populate Database Script](phase1/Programming/populate_pg_db.py)

<img width="1205" height="936" alt="צילום מסך 2026-03-27 160754" src="https://github.com/user-attachments/assets/a4dca697-4263-4f2f-bb19-936eae152319" />

---

### 2. Mockaroo (SQL Inserts)

📜[Insert Data into TOURIST Table](phase1/mockarooFiles/TOURIST.sql)

📜[Insert Data into RENTAL_COMPANY Table](phase1/mockarooFiles/RENTAL_COMPANY.sql)

📜[Insert Data into CAR Table](phase1/mockarooFiles/CAR.sql)

<img width="1894" height="565" alt="צילום מסך 2026-03-26 201918" src="https://github.com/user-attachments/assets/a118afbd-8ff1-4b48-b8d5-74110c3f7cc2" />

<img width="1885" height="479" alt="צילום מסך 2026-03-26 201925" src="https://github.com/user-attachments/assets/5480da64-473b-4807-9da3-64cfe31d55b9" />

<img width="1474" height="766" alt="צילום מסך 2026-03-26 202024" src="https://github.com/user-attachments/assets/b808d8bd-39f7-4682-98df-aa2474e6d3aa" />



---

### 3. CSV Files (Mockaroo)

📜[csv for TOURIST Table](phase1/csvFiles/touristMOCK_DATA.csv)

📜[csv for RENTAL_COMPANY Table](phase1/csvFiles/rentalcompanyMOCK_DATA.csv)

<img width="1404" height="533" alt="צילום מסך 2026-03-27 173554" src="https://github.com/user-attachments/assets/f67b9c81-00a4-4cb1-bc7f-bed032cc4174" />

<img width="1047" height="821" alt="צילום מסך 2026-03-27 173744" src="https://github.com/user-attachments/assets/9344e476-cfb8-47d2-b5f2-56b177122ee4" />

<img width="1002" height="378" alt="צילום מסך 2026-03-27 173753" src="https://github.com/user-attachments/assets/7733213b-12df-4fb8-bc25-254c39d7bc9e" />

---

## Backup & Restore  

### Backup  
The database backup was created using pgAdmin. 

[To the backup Folder](phase1/Backup/)

<img width="1053" height="826" alt="צילום מסך 2026-03-27 174521" src="https://github.com/user-attachments/assets/63c8dbef-9c05-4eb2-aa8f-7086847bd053" />

<img width="854" height="390" alt="צילום מסך 2026-03-27 174108" src="https://github.com/user-attachments/assets/4d138d01-51ff-45aa-b7c1-b81c972c7f03" />

---

### Restore  
The backup was successfully restored using pgAdmin restore functionality.

<img width="3402" height="1052" alt="database_restore" src="https://github.com/user-attachments/assets/0a5e1d40-7a49-4360-a625-648a92c06cf0" />
<img width="1766" height="902" alt="צילום מסך 2026-04-15 144521" src="https://github.com/user-attachments/assets/8705e65b-b889-4c4a-8027-256b38d33e98" />


---

# Phase 2: Database Management, Advanced Queries & Performance
This phase focuses on implementing advanced SQL logic, maintaining data integrity, and optimizing the database performance.

---

 ## Complex SELECT Queries (Double Implementation)
For each query, two different approaches were implemented and compared for efficiency.

(The order in the screenshots may be different, but it's the same data between two query options.)

### Query 1: Find Available Cars in Jerusalem
Description: שליפת כל הרכבים הזמינים להשכרה בעיר ירושלים עבור דף החיפוש הראשי.

Approach A (JOIN): Standard and readable.

Approach B (EXISTS): Often faster as it stops at the first match found in the subquery.

Efficiency Analysis: EXISTS is more efficient for "existence" checks because it stops at the first match (Short-circuit), whereas JOIN creates a temporary table of all matches before filtering.

📜 [Query1](phase2/Queries.sql)

<img width="1496" height="761" alt="צילום מסך 2026-04-24 162203" src="https://github.com/user-attachments/assets/091177a4-8d50-43ba-934d-b1abfef3904f" />
<img width="1487" height="784" alt="צילום מסך 2026-04-24 162346" src="https://github.com/user-attachments/assets/7715877a-58a1-483a-bd9c-e66dde0a6669" />


### Query 2: Loyal Customers (5+ Bookings in 2026)
Description: זיהוי תיירים שביצעו יותר מ-5 הזמנות במהלך שנת 2026 .

Approach A (IN with Subquery): Efficient for simple membership filtering.

Approach B (JOIN & HAVING): Required if we want to display the actual count.

Efficiency Analysis: JOIN is better if the GUI needs to display the total_bookings count. IN can be optimized by the engine when only the identity of the tourist is needed.

📜 [Query2](phase2/Queries.sql)

<img width="1495" height="790" alt="צילום מסך 2026-04-24 162643" src="https://github.com/user-attachments/assets/9c43d7cb-32e5-4c9c-977b-7eccd42d3718" />
<img width="1479" height="790" alt="צילום מסך 2026-04-24 162627" src="https://github.com/user-attachments/assets/91402e7d-3f19-4e80-98e7-2e8c24517fe8" />

### Query 3: Recommended Cars (Rating 4+)
Description: שליפת רכבים שזכו לדירוג ממוצע של 4 ומעלה עבור מסך "רכבים מומלצים".

Approach A (Subquery in FROM): Pre-calculates averages.

Approach B (Double JOIN & HAVING): Direct approach.

Efficiency Analysis: Approach A can be more efficient if the subquery significantly reduces the number of rows (by grouping reviews) before joining with the larger CAR table.

📜 [Query3](phase2/Queries.sql)

<img width="1088" height="783" alt="צילום מסך 2026-04-24 163144" src="https://github.com/user-attachments/assets/b3d74d6d-49b6-4320-bbf1-2e330f9aa71c" />
<img width="1139" height="804" alt="צילום מסך 2026-04-24 163123" src="https://github.com/user-attachments/assets/ea911ca0-e3ad-463b-9b90-0e5a4af35eae" />


### Query 4: Top 3 Most Booked Cars in 2026
Description: הצגת שלושת הרכבים המבוקשים ביותר (הכי הרבה הזמנות) בשנת 2026.

Approach A (Subquery in FROM): Aggregates data before joining.

Approach B (JOIN & GROUP BY): Simplest implementation.

Efficiency Analysis: Approach A is faster when the BOOKING table is massive, as it reduces the join complexity by summarizing the IDs first.

📜 [Query4](phase2/Queries.sql)

<img width="1472" height="781" alt="צילום מסך 2026-04-24 163459" src="https://github.com/user-attachments/assets/aeb3f95e-781f-423c-9d44-7f9ed10be1e0" />
<img width="1298" height="766" alt="צילום מסך 2026-04-24 163431" src="https://github.com/user-attachments/assets/290f1c4e-39df-44bd-8895-36a8adcd9b1b" />


## Additional SELECT Queries
---

### Query 5: Personal Booking History
Description: היסטוריית הזמנות מפורטת עבור תייר ספציפי (למסך "הזמנות שלי"). משתמש ב-LEFT JOIN כדי להציג הזמנות גם אם טרם הושארה להן ביקורת.

📜 [Query5](phase2/Queries.sql)

<img width="1426" height="761" alt="צילום מסך 2026-04-24 163642" src="https://github.com/user-attachments/assets/57caf8c0-62bc-441a-910c-2f8019c148a4" />


### Query 6: Monthly Revenue Report 2026
Description: דוח הכנסות חודשי מפורט עבור שנת 2026, כולל כמות השכרות וסך הכנסה חודשית.

📜 [Query6](phase2/Queries.sql)

<img width="1189" height="800" alt="צילום מסך 2026-04-24 163744" src="https://github.com/user-attachments/assets/d13a7a75-e733-4d36-a552-1f157cdc2972" />

### Query 7: Top 3 most popular pickup locations
Description: זיהוי הערים שבהן מתבצעות הכי הרבה השכרות כדי לדעת איפה כדאי להגדיל את צי הרכבים.

📜 [Query7](phase2/Queries.sql)

<img width="893" height="758" alt="צילום מסך 2026-04-24 164059" src="https://github.com/user-attachments/assets/699be3f7-5da5-45f1-aef1-e0fba216ba38" />

### Query 8: Most recommended rental company (Highest average rating)
Description: שליפת החברה בעלת ממוצע הדירוגים הגבוה ביותר (בתנאי שיש לה לפחות 2 ביקורות כדי להבטיח אמינות).

📜 [Query8](phase2/Queries.sql)

<img width="1225" height="776" alt="צילום מסך 2026-04-24 164242" src="https://github.com/user-attachments/assets/b2d94798-62c6-4f4a-a723-e3ab8f281c3f" />

### Query 9: Budget-friendly cars (Price <= 70) with location details
Description: סינון רכבים שמחירם היומי נמוך מ-70, כולל הצגת שם החברה והעיר שבה הם נמצאים.

📜 [Query9](phase2/Queries.sql)

<img width="1141" height="822" alt="צילום מסך 2026-04-24 164326" src="https://github.com/user-attachments/assets/035bd7b1-fd14-459c-8fcd-43847b0944f4" />

---

## UPDATE & DELETE Operations

### Update 1: Seasonal Price Hike (SUV)
* **Description:** העלאת מחיר יומית ב-10% לכל רכבי ה-SUV לטובת עונת השיא.

<img width="1479" height="764" alt="צילום מסך 2026-04-24 171311" src="https://github.com/user-attachments/assets/d7e7e449-f956-4418-b253-a1843bd9be62" />

<img width="1491" height="771" alt="צילום מסך 2026-04-24 171355" src="https://github.com/user-attachments/assets/378451c8-ae0e-4675-8e92-12f13aa6ac51" />

### Update 2: Auto-cancel Expired Bookings
* **Description:** עדכון סטטוס ל'מבוטל' עבור הזמנות שמועד האיסוף שלהן עבר והן טרם התחילו.

<img width="1490" height="774" alt="צילום מסך 2026-04-24 172045" src="https://github.com/user-attachments/assets/07296779-2fa6-4f7d-9c9d-935e323ca67e" />

<img width="960" height="407" alt="צילום מסך 2026-04-24 172111" src="https://github.com/user-attachments/assets/7b771a70-c862-4f87-98e3-8ce9f6af151f" />

<img width="1494" height="702" alt="צילום מסך 2026-04-24 172150" src="https://github.com/user-attachments/assets/ad2a4a9c-0183-4cb4-9a0a-c2f8b63e51c0" />

### Update 3: Update company contact information
* **Description:** עדכון פרטי קשר – עדכון מספר הטלפון של חברת 'Hertz' במערכת הניהול.

<img width="1180" height="441" alt="צילום מסך 2026-04-24 172556" src="https://github.com/user-attachments/assets/b12d5869-aace-4c9d-af14-46de0bd9137d" />

<img width="1098" height="529" alt="צילום מסך 2026-04-24 172627" src="https://github.com/user-attachments/assets/91dda945-48aa-4271-bfe8-9c231314b502" />

--- 

### Delete 1: Remove Low-Quality Reviews
* **Description:** ניקוי נתונים – מחיקת ביקורות עם דירוג 1 כוכבים שאינן כוללות תגובה טקסטואלית, כדי לשמור על דאטה איכותי.

<img width="1329" height="771" alt="צילום מסך 2026-04-24 173659" src="https://github.com/user-attachments/assets/796ebd40-6a4a-4f01-b21e-a9d8648e7239" />

<img width="989" height="528" alt="צילום מסך 2026-04-24 173721" src="https://github.com/user-attachments/assets/520b9d11-2853-4008-a4f0-18027c061171" />

### Delete 2: Decommission Old Vehicles
* **Description:** רענון צי הרכבים – מחיקת רכבים משנת 2002 ומטה, בתנאי שהם אינם מושכרים כרגע (סטטוס שונה מ-'Rented').
  
<img width="1483" height="744" alt="צילום מסך 2026-04-24 174758" src="https://github.com/user-attachments/assets/c35531df-186a-4f3b-b3eb-1ae2b9607d0b" />

<img width="1438" height="771" alt="צילום מסך 2026-04-24 174904" src="https://github.com/user-attachments/assets/dd7bad11-e2c1-4e97-939d-ee299fd5165e" />



#### The Challenge (Foreign Key Violation):

Initially, a simple DELETE command failed because of Referential Integrity. In our database schema, the CAR table is linked to the BOOKING table via a Foreign Key (car_id). PostgreSQL prevents the deletion of a car if there are existing booking records associated with it. Deleting such a car would leave "orphaned" bookings, breaking the data consistency.

#### The Solution:

To resolve this without deleting important historical booking data, we updated the query to include a subquery using the NOT IN operator.


### Delete 3: Remove Inactive Locations
* **Description:** תחזוקת מיקומים – מחיקת מיקומים (ערים) שאינם מקושרים לאף סניף של חברת השכרה.

<img width="1447" height="785" alt="צילום מסך 2026-04-24 175824" src="https://github.com/user-attachments/assets/36ae0f01-d646-41bd-b568-3965c8f24dad" />


<img width="1407" height="776" alt="צילום מסך 2026-04-24 175901" src="https://github.com/user-attachments/assets/f3c15ffa-7f85-49df-9f41-de8f27c23cb6" />


---

## Constraints (Data Integrity)
Implementation of business rules using the `ALTER TABLE` command to ensure data quality and prevent human errors.

📜 [Constraints](phase2/Constraints.sql)

### Constraint 1: Tourist Phone Length
* **Description:** Ensuring phone numbers are at least 7 digits long.

<img width="1472" height="800" alt="צילום מסך 2026-04-24 150159" src="https://github.com/user-attachments/assets/60142add-3078-4519-b4a9-36ee71c69f82" />

<img width="1180" height="499" alt="צילום מסך 2026-04-24 150243" src="https://github.com/user-attachments/assets/711e3f31-27c0-45c9-8471-fbc43239668e" />


### Constraint 2: Email Format Validation
* **Description:** Enforcing a basic email format by requiring at least one dot (.) in the email string.

<img width="1489" height="800" alt="צילום מסך 2026-04-24 150343" src="https://github.com/user-attachments/assets/faa6a6cd-fd1c-404c-871f-6babde43f8df" />

<img width="1235" height="599" alt="צילום מסך 2026-04-24 150504" src="https://github.com/user-attachments/assets/b334ad28-7132-4e71-8ff1-4ac092fdc8cc" />


### Constraint 3: Minimum Car Price Threshold
* **Description:** A business rule to ensure daily rental prices are not set below 50 ILS.

<img width="1467" height="799" alt="צילום מסך 2026-04-24 150548" src="https://github.com/user-attachments/assets/2de8b078-c33f-47de-a1d1-3a0d99ad5276" />

<img width="1511" height="613" alt="צילום מסך 2026-04-24 150638" src="https://github.com/user-attachments/assets/32defb02-1544-4a09-83de-a7d205552648" />

---

## Transactions (Commit & Rollback)
Demonstrating how transactions maintain database consistency and allow recovery from errors.

📜 [Rollback&Commit](phase2/RollbackCommit.sql)

### Rollback Demo: Recovering from Mistakes

#### Scenario: 
An accidental price hike where SUV prices were doubled.

#### Process:
Before: Showed original prices

<img width="1128" height="764" alt="צילום מסך 2026-04-24 144633" src="https://github.com/user-attachments/assets/e4a10736-fb24-4d82-bfa5-7f3a1ce95200" />

Action: Updated prices within a BEGIN block.

Intermediate: Showed new prices 

<img width="1121" height="753" alt="צילום מסך 2026-04-24 144723" src="https://github.com/user-attachments/assets/700d83ca-675b-46f3-ac08-20840bf43e61" />

Undo: Executed ROLLBACK.

After: Verified prices returned to original.

<img width="1102" height="673" alt="צילום מסך 2026-04-24 144817" src="https://github.com/user-attachments/assets/4415b740-0160-4503-aa94-8deccfc8dfce" />

---

### Commit Demo: Permanent Changes

#### Scenario: 
Updating a car status to 'Maintenance' for the service team.

#### Process:

Before: Showed original prices

<img width="1082" height="502" alt="צילום מסך 2026-04-24 144958" src="https://github.com/user-attachments/assets/3377cfcf-72a7-465e-ae56-5ba6139afaac" />


Action: Changed status within a BEGIN block.

<img width="1076" height="493" alt="צילום מסך 2026-04-24 145034" src="https://github.com/user-attachments/assets/66bb7fa8-375d-439e-9cca-8a87353dd121" />

Finalize: Executed COMMIT.

Verification: Verified the change persisted after the transaction closed.

<img width="1255" height="730" alt="צילום מסך 2026-04-24 145051" src="https://github.com/user-attachments/assets/fddede54-bf54-4d7d-8041-46cedaac695c" />


## Indexes & Performance Optimization
To optimize the system's performance, we implemented B-Tree indexes on frequently searched and sorted columns. We used EXPLAIN ANALYZE to measure the execution time before and after the optimization.

📜 [Indexes](phase2/Index.sql)

### Index 1: Sorting by Price (idx_car_price_sort)

#### Purpose: 

Optimizing the "Price: Low to High" filter in the car catalog

#### Before Optimization: 

<img width="1460" height="763" alt="צילום מסך 2026-04-24 151448" src="https://github.com/user-attachments/assets/7895163a-ceb9-4393-80e5-63df2cb73355" />


#### After Optimization: 

<img width="1463" height="790" alt="צילום מסך 2026-04-24 151512" src="https://github.com/user-attachments/assets/791af0b4-15f7-4278-8232-8ec0be8f64e9" />


#### Analysis: 
The index allows the database to retrieve rows in a pre-sorted order from the B-Tree structure, significantly reducing the overhead of sorting large datasets in memory.

### Index 2: Searching by City (idx_location_city_search)

#### Purpose: 

Accelerating the location search on the homepage.

#### Before Optimization: 

The database performed a Sequential Scan, checking every row in the table.

<img width="1487" height="803" alt="צילום מסך 2026-04-24 153027" src="https://github.com/user-attachments/assets/dbc18056-113e-4498-b89f-9efd6794abf7" />


#### After Optimization: 

The database used a Bitmap Index Scan, jumping directly to the relevant data.

<img width="1493" height="787" alt="צילום מסך 2026-04-24 153044" src="https://github.com/user-attachments/assets/4a99f63b-87c2-4fb0-a5bc-f2b9cae0710c" />


### Index 3: Date Range Filtering (idx_booking_pickup_idx)

#### Purpose: 

Speeding up administrative reports for specific booking periods

#### Before Optimization:

Used a Sequential Scan to filter 13,736 rows

<img width="1472" height="778" alt="צילום מסך 2026-04-24 151915" src="https://github.com/user-attachments/assets/ba7a634b-9b95-4609-9ca9-93d7f12d14bf" />


#### After Optimization: 

Used a Bitmap Index Scan, which is much more efficient for range queries

<img width="1472" height="773" alt="צילום מסך 2026-04-24 151956" src="https://github.com/user-attachments/assets/223d099c-fff8-4f25-8f7b-adeb7cb33d0e" />


## Phase 3: System Integration & Database Views
This phase represents the final integration of the Car Rental system with a Restaurant Reservation system, creating a unified tourism ecosystem.

---
## Integration & Design Decisions

### Overview
The goal of this phase was to merge two independent models into a single, holistic database for tourists.

### Methodology & Tooling
To ensure a safe and organized integration process, we utilized **ERDPlus**. We began by duplicating our original Car Rental ERD to create a working sandbox. On this duplicated version, we performed all necessary modifications, additions, and entity unifications required for the restaurant integration. This approach allowed us to maintain the integrity of our initial design while evolving the model into its final, integrated state.

### Core Entities & Global Unification
The foundation of the integration rests on unifying the core entities present in both models:
* **Tourist Entity:** We merged all fields from both models. The final model includes identification (Passport Number), contact details (Email, Phone), and system access credentials (Username, Password, Birthday) to provide a single sign-on experience across all tourism services (And another feature - language).

* **Location Hierarchy (Country & City):** We adopted the more detailed hierarchy (Country -> City). All rental companies and restaurants are now linked to a specific City entity, preventing data duplication and enabling precise geographical filtering.

### Key Design Decisions

#### 1. Separation of Bookings
Despite their logical similarity, we maintained `Car_Booking` and `Rest_Booking` as separate entities.
* **Rationale:** Each booking type possesses unique and critical attributes that do not overlap (e.g., return dates and pickup locations for cars vs. the number of people for restaurant tables).
* **Benefit:** This separation prevents a high frequency of `NULL` values and ensures strict data validation for each business domain.

#### 2. Unified Reviews & Detailed Rating Entity
Following the "Broadest Model" integration principle, we maintained the granular feedback structure originally found in the Restaurant system.
* **Structural Preservation:** We kept the `Rating` component as a separate entity linked to the unified `Review` table.
* **Identifying Relationship:** In the integrated schema, `Rating` remains defined as a **Weak Entity** with an identifying relationship to the `Review`. This ensures that the detailed scores are always anchored to their parent review via the `review_id`.
* **Integrated Capability:** By preserving this structure, the combined system now supports multiple specific ratings (such as Service, Cleanliness, or Food) for both car rentals and restaurant bookings within a single unified framework.
  
#### 3. Optional Constraints (Nullability)
To allow a single `Review` entry to refer to either a restaurant or a car/company, we utilized **Optional Constraints**. The foreign keys (`rest_id`, `car_id`) are defined as nullable, providing the flexibility to link a review to the relevant target while keeping other reference fields empty.

## Integrated ERD & Relational Schema

### ERD & DSD of the Restaurant Component (New Wing)

<img width="3744" height="1707" alt="תמונה ERD מסעדות" src="https://github.com/user-attachments/assets/a288cf96-5350-4b84-bf40-7676ef344099" />

<img width="3744" height="1707" alt="DSD של ERDPLUS למסעדות" src="https://github.com/user-attachments/assets/07102a92-eb25-49e3-a509-e098cb6b6fc3" />

<img width="1129" height="822" alt="DSD מסעדות" src="https://github.com/user-attachments/assets/2c1b870b-d25a-4a52-9ca3-68933dc2b84c" />

### ERD & DSD of the Integrated System

<img width="3744" height="1707" alt="ERD מאוחד" src="https://github.com/user-attachments/assets/913edc81-7727-4046-a6e6-8ee1ea5bb187" />

<img width="3744" height="1707" alt="DSD מאוחד" src="https://github.com/user-attachments/assets/35984fed-0dfd-4455-9d39-1c1cb1b91f0a" />

<img width="1362" height="986" alt="צילום מסך 2026-05-21 095856" src="https://github.com/user-attachments/assets/8962fe34-5e42-4ee9-9d82-e57e78b0cace" />



### Architectural Decisions During Integration

* **Single Source of Truth for Users (`tourist`):** Instead of keeping two separate user tables, all user/tourist records were consolidated into a single central `tourist` table. Attributes unique to the car rental domain (`passportnumber`) and the restaurant domain (`language`, `birthday`, `user_name`, `password`) were merged into this single entity.
* **Conflict Resolution via Identity Shifting:** To prevent Primary Key conflicts during insertion, all incoming tourist IDs from the car rental schema were systematically shifted by `+10000`. 
* **Data Preservation for Unique Constraints:** To bypass `UNIQUE` constraint violations on `phone` and `email` without dropping duplicate users (which would cause foreign key orphan issues), car rental users with conflicting phone/emails had a `_car` suffix appended to their unique fields.
* **Semantic Entity Disambiguation:** The booking tables were split and renamed to `car_booking` and `rest_booking` to clearly separate the business logic of each domain while keeping them linked to the unified `tourist` table.
* **Normalization Overhaul (Geographic Locations):** The unstructured text-based `location` table from the car rental system was deprecated. Instead, we aligned the entire ecosystem with the restaurant domain's strictly normalized `city` and `country` tables to ensure higher data integrity and reduce redundancy.
* **Polymorphic Review Architecture:** The `feedback` table was transformed into a unified `review` table. Instead of linking reviews only to bookings, we realigned the schema so a review points directly to the core physical entities (`car_id` or `restaurant_id`), matching the decoupled ERD design requirements.

### Step-by-Step Technical Process & Command Breakdown

#### Step 1: Schema Expansion & User Consolidation
* **Commands:** `ALTER TABLE ... ADD COLUMN`, `UPDATE ... SET phone = phone || '_car'`, `INSERT INTO public.tourist`.
* **Explanation:** We expanded the main `tourist` table to host all merged attributes. Before migrating data, an existential check (`WHERE EXISTS`) scanned for duplicate phone numbers/emails and appended a `_car` tag to conflicting rental users. Then, rental IDs were offset by `10000` to prevent collision with restaurant IDs before being appended to the unified table.

#### Step 2: Booking Realignment
* **Commands:** `ALTER TABLE ... RENAME TO`, `ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY`.
* **Explanation:** Legacy booking tables were renamed to `car_booking` and `rest_booking`. Orphaned entries pointing to invalid IDs were routed to a safe fallback (`tourist_id = 1`) before establishing official cascaded foreign keys back to the new unified `tourist` table.

#### Step 3: Review & Rating Unification
* **Commands:** `ALTER TABLE ... DROP NOT NULL`, `INSERT INTO ... SELECT ... ROW_NUMBER()`, `DROP TABLE`.
* **Explanation:** The restaurant `feedback` table was altered to allow `NULL` values for `rest_id`, since car reviews do not possess restaurant context. Data from the car `review` table was poured into `feedback` using `ROW_NUMBER()` to dynamically calculate unique IDs. Numeric scores were extracted and normalized into the `rating` table. Finally, the legacy `review` table was dropped, and `feedback` was renamed to `review`.

#### Step 4: Geographic Normalization
* **Commands:** `UPDATE ... SET city_id = c.city_id FROM ...`, `ALTER TABLE ... DROP COLUMN`.
* **Explanation:** We introduced `city_id` references into `rental_company` and `car_booking` (for pickup and return cities). Using `LOWER(TRIM())` matching, string text values from the old schema were translated into relational IDs from the new `city` table. Flat text columns and the outdated `location` table were then purged.


📜 [Integrate.sql](phase3/Integrate.sql)


## Database Views
### 📊 View 1: v_car_rental_summary
* **View Description:** This operational view serves the car rental branch. It consolidates car bookings, physical car specifications (brand and model), full customer names, and geographic pickup cities into a single dashboard. It provides the operations department with an overview of active workflows, dates, and financial inputs.

<img width="1413" height="800" alt="view1" src="https://github.com/user-attachments/assets/1738f6e6-a60c-4737-b598-e878fb712189" />


* **Query 1 Description:** This query aggregates the view data by pickup city, calculating the total number of rentals and cumulative revenue per city. It helps track regional performance and identify high-value markets.

<img width="1360" height="809" alt="view1query1" src="https://github.com/user-attachments/assets/884c4987-3ed5-4abd-baeb-58f1b6dab856" />


* **Query 2 Description:** This query filters and groups data by customer name to identify VIP clients who have spent more than 1,500 total currency units on car rentals, allowing the business to run loyalty and retention campaigns.

<img width="1273" height="800" alt="view1query2" src="https://github.com/user-attachments/assets/b7e9d4cf-c6a0-499a-bbe8-d6f38e3b75f7" />


### 📊 View 2: v_restaurant_booking_summary
* **View Description:** This view represents the analytical core of the restaurant branch. It joins restaurant reservation metrics with the underlying restaurant configurations (cuisine type), customer names, and restaurant cities. It is designed to evaluate dining traffic and spot trends in reservation choices.

<img width="1399" height="802" alt="view2" src="https://github.com/user-attachments/assets/c79608f7-6640-476d-8b77-89fecbd76ee2" />


* **Query 1 Description:** This query breaks down booking counts and calculates the average party size (group size) for each cuisine type, illustrating which types of food attract large group events vs. smaller parties.

<img width="1413" height="670" alt="view2query1" src="https://github.com/user-attachments/assets/035184bb-d502-4a96-8571-513f5c567c07" />


* **Query 2 Description:** This analytical query extracts the ISO day of the week from the booking dates to calculate the total number of bookings and individual diners hosted per weekday. This allows administrators to optimize operational hours, marketing efforts, and staff allocation for peak days.

<img width="1404" height="808" alt="view2query2" src="https://github.com/user-attachments/assets/09e0db42-5732-4794-8f5a-85cbcad6f311" />


### 📊 View 3: v_unified_customer_feedback
* **View Description:** A fully integrated cross-domain analytical view mapping the newly unified review and rating architecture. It merges reviewer profiles, custom review text titles, and numeric scores while using dynamic conditional logic (`COALESCE`) to explicitly display the reviewed item—flagging whether it was a specific car fleet brand or a restaurant location.

<img width="1328" height="808" alt="view3" src="https://github.com/user-attachments/assets/96b6d273-925a-41ea-b7ec-4c34ba9cc525" />


* **Query 1 Description:** This macro-level query divides review counts and averages total numeric scores between the car rental and restaurant sectors, giving senior executives an instant quality comparison between both business units.

<img width="1414" height="539" alt="view3query1" src="https://github.com/user-attachments/assets/54418899-2046-4c82-adde-d9ef77419b03" />


* **Query 2 Description:** This operational query isolates critical negative feedback by screening for rating scores of 2 or below. It generates an active risk queue displaying customer names, problem details, and specific low ratings for urgent support intervention.

<img width="1317" height="809" alt="view3query2" src="https://github.com/user-attachments/assets/93553dcf-3c70-4c18-9cd2-58092b4b403a" />

📜 [Views.sql](phase3/Views.sql)

# Phase 4: Database Programming (PL/pgSQL)
---

## Functions 

### Function 1: fn_get_tourist_activity
* **Function Description:** This integrative function extracts a comprehensive activity statement for a specific tourist across the merged database ecosystem. It accepts a tourist ID (`p_tourist_id`) as an input parameter and returns a dynamically bound **`REFCURSOR`** containing all linked review entries and rating scores, while automatically resolving the business sector type (Car vs. Restaurant). Additionally, it leverages an **Explicit Cursor** wrapped in a programmatic loop to calculate the tourist's cumulative financial expenditure within the system. Robust error-handling is enforced via an **`EXCEPTION`** block to catch non-existent IDs and gracefully prevent runtime crashes.

📜 [Function1](phase4/Functions/fn_get_tourist_activity.sql)

<img width="1388" height="777" alt="צילום מסך 2026-05-28 205440" src="https://github.com/user-attachments/assets/3f5c7a4f-dae0-4d5f-bcdb-8aaafa95831c" />


📜 [RunFunction1](phase4/RunFunctions/test_fn_get_tourist_activity.sql)

<img width="1389" height="777" alt="צילום מסך 2026-05-28 221720" src="https://github.com/user-attachments/assets/0d5fea05-4383-40c6-a9e0-7a2f500ebb3d" />
<img width="754" height="451" alt="צילום מסך 2026-05-28 210841" src="https://github.com/user-attachments/assets/a76e163d-3114-4f77-bd3a-847cb1751842" />
<img width="1231" height="460" alt="צילום מסך 2026-05-28 210911" src="https://github.com/user-attachments/assets/5774f752-9fbd-4391-ad80-cd62f52fafb0" />


### Function 2: fn_calculate_city_health_index
* **Function Description:** This complex analytical function calculates a consolidated "Business Health Index" score for a given city provided as a text parameter (`p_city_name`). It uses **Implicit Cursors** via embedded `SELECT INTO` operations to measure and compare average restaurant ratings against car rental fleet pickup scores within that specific municipality. The function implements multi-conditional branching (`IF-THEN-ELSE`) to normalize these raw figures into a standardized 1-to-100 index rating. To secure high data stability, an **`EXCEPTION`** interceptor blocks data anomalies (such as a division-by-zero if a city has zero reviews) and returns a safe fallback score of `0` accompanied by a system warning log.

📜 [Function2](phase4/Functions/fn_calculate_city_health_index.sql)

<img width="1253" height="556" alt="צילום מסך 2026-05-28 212742" src="https://github.com/user-attachments/assets/f4a78d70-7dfb-45a2-88db-b65ad0c2d081" />


📜 [RunFunction2](phase4/RunFunctions/test_fn_calculate_city_health_index.sql)


<img width="1169" height="436" alt="צילום מסך 2026-05-28 211746" src="https://github.com/user-attachments/assets/faab2099-eaa7-4b13-b224-88391ab46b4b" />
<img width="1096" height="421" alt="צילום מסך 2026-05-28 211816" src="https://github.com/user-attachments/assets/b8a07434-70c0-4a17-9af6-73d581fa5e35" />
<img width="1136" height="420" alt="צילום מסך 2026-05-28 212832" src="https://github.com/user-attachments/assets/d94907c2-da1c-423e-a9c3-f37efd06137e" />
<img width="1084" height="417" alt="צילום מסך 2026-05-28 212840" src="https://github.com/user-attachments/assets/8d61ca3a-7089-407b-9366-761ec6cbb453" />
<img width="1398" height="416" alt="צילום מסך 2026-05-28 212008" src="https://github.com/user-attachments/assets/0d976204-c890-46f7-81cf-dfdc1f7feeba" />
<img width="1308" height="452" alt="צילום מסך 2026-05-28 211957" src="https://github.com/user-attachments/assets/dcc9d74c-406b-4271-9fba-bbd45b960ebc" />

## Procedures

### Procedure 1: pr_apply_strategic_discounts
* **Procedure Description:** This administrative control procedure automates a dynamic marketing markdown system based on real-time analytical metrics. It utilizes an **Explicit Cursor** to loop through all active car rental agencies row-by-row into a structurally defined **Record Variable**. For every company, it checks the analytical performance index of its base municipality by calling our custom function (`fn_calculate_city_health_index`). If a company is determined to be operating inside a low-performing area (score lower than 60), the block triggers an active **DML UPDATE** command reducing the daily hiring price of all cars managed by that entity by **10%**. Progress is monitored via inline row count tracking (`ROW_COUNT`) and server telemetry outputs.

📜 [Procedure1](phase4/Procedures/pr_apply_strategic_discounts.sql)

<img width="1112" height="635" alt="צילום מסך 2026-05-28 222630" src="https://github.com/user-attachments/assets/a765328a-7ffe-4623-976a-737a8646f042" />


📜 [RunProcedure1](phase4/RunProcedures/test_pr_apply_strategic_discounts.sql)

<img width="1340" height="810" alt="צילום מסך 2026-05-28 223528" src="https://github.com/user-attachments/assets/c7c97142-e133-446e-b0ef-04ff0488e45d" />

<img width="1405" height="513" alt="צילום מסך 2026-05-28 223540" src="https://github.com/user-attachments/assets/7ca14db5-f185-4670-9a44-ecbe637a8800" />

> **Execution Analysis & Database Integrity Proof:**
> As demonstrated in the console output telemetry above, the procedure `pr_apply_strategic_discounts` executed its analytical loop successfully across all target rows. 
>
> 1. **Data Integration in Action:** The block evaluated each rental company's location using our analytical function `fn_calculate_city_health_index`. When it scanned *Company 19* in *"Jagüey Grande"*, it recorded a low business score of `50/100` and successfully dispatched a batch **DML UPDATE**, modifying 23 car asset records simultaneously.
> 2. **Constraint Enforcement:** Upon reaching *Company 21* in *"Tulyushka"* (also scoring `50/100`), the 10% markdown attempted to drop a car's rate below the allowed minimum financial threshold. Immediately, the core database schema blocked the operation by raising a **Check Constraint Violation** (`chk_min_price_threshold`) created in Phase 2.
> 3. **Robust Exception Handling:** Instead of suffering a critical system crash or leaving the database in a partially updated state, our PL/pgSQL **`EXCEPTION` block** instantly intercepted the runtime error, safely aborted the transaction sub-block, and printed a clean diagnostic summary to the console. This guarantees absolute data consistency and system resilience.

####  Procedure 2: pr_book_integrated_package
* **Procedure Description:** This transactional procedure operates as an all-or-nothing omni-channel booking gateway for cross-domain travel packages. It takes parameters for a simultaneous vehicle rental and fine-dining reservation under a single workflow. It enforces strict business constraints, ensuring customer verification and proper chronological sequence rules (verifying return dates do not precede collection points). If valid, it increments primary key states and triggers multiple sequential **DML INSERT** statements onto both the car and restaurant schema cores. If any portion fails, the custom constraint engine aborts execution, intercepts the runtime error using an **`EXCEPTION`** handle, issues an immediate console diagnostic log, and triggers a system safety protection protocol to prevent partial data updates.

📜 [Procedure2](phase4/Procedures/pr_book_integrated_package.sql)

<img width="1126" height="648" alt="צילום מסך 2026-05-28 224145" src="https://github.com/user-attachments/assets/8b5ad514-6953-4b20-9ffc-bb2f5538c076" />

📜 [RunProcedure2](phase4/RunProcedures/test_pr_book_integrated_package.sql)

<img width="1223" height="674" alt="צילום מסך 2026-05-28 224711" src="https://github.com/user-attachments/assets/a98624c3-7c0a-409e-ae11-c98c05a7504c" />

<img width="1414" height="700" alt="צילום מסך 2026-05-28 224807" src="https://github.com/user-attachments/assets/7a3baf90-48fe-4914-809c-86cf63b1da19" />

## Triggers

### Trigger 1: `trg_sync_vip_tourist_status`
* **Target Relation (Table):** `public.car_booking`
* **Execution Phase:** `AFTER INSERT OR UPDATE` (Row-Level)
* **Design Objective:** Cross-domain customer tier synchronization.
* **Technical Overview:** This trigger operates as an event listener for marketing automation. Whenever a new car booking is registered or updated, the underlying trigger function evaluates the transactional volume using the structural **`NEW`** row state. If a rental price exceeds a premium threshold of **$500.00**, the system intercepts the event and automatically executes an ecosystem synchronization protocol, emitting real-time telemetry alerts to unlock corresponding premium benefits and priority restaurant booking status for that unified tourist.

📜 [Trigger1](phase4/Triggers/trg_sync_vip_tourist_status.sql)

<img width="1246" height="640" alt="צילום מסך 2026-05-29 172751" src="https://github.com/user-attachments/assets/36e8b0ff-c19c-49ad-b5f2-6f19576e07a4" />


📜 [RunTrigger1](phase4/RunTriggers/test_trg_sync_vip_tourist_status.sql)

<img width="1348" height="548" alt="צילום מסך 2026-05-29 173420" src="https://github.com/user-attachments/assets/d3f65c14-8833-4718-a01d-600f285a3cd7" />

> **Automated Cross-Domain Event Telemetry:**
> This console execution log confirms the operational deployment of the `trg_sync_vip_tourist_status` architecture. 
> 
> 1. **Data Driven Action:** Upon executing a standard `INSERT` statement on the vehicle leasing registry, the backend engine immediately triggered our PL/pgSQL function.
> 2. **State Evaluation:** The row listener successfully scrutinized the context data via the `NEW` state modifier. Since the parameter value ($1,200.00) bypassed our designated financial baseline restriction (> $500), it verified the transaction and dynamically logged the automated VIP cross-domain integration notification to synchronize customer perks seamlessly.

### Trigger 2: `trg_prevent_excessive_diners`
* **Target Relation (Table):** `public.rest_booking`
* **Execution Phase:** `BEFORE INSERT OR UPDATE` (Row-Level)
* **Design Objective:** Enforcing defensive business rules and physical capacity constraints.
* **Technical Overview:** This trigger functions as a server-side gatekeeper to prevent capacity infrastructure overload within the restaurant domain. Before any insert or update statement modifies the database state, the trigger function monitors the incoming record's guest count column (`num_of_people`) via the **`NEW`** row modifier. If a single booking attempts to allocate a table for **more than 20 diners**, the execution is immediately blocked. The trigger throws a severe database exception, halting the transaction execution flow entirely and rolling back the operational statement to protect the target system parameters.

📜 [Trigger2](phase4/Triggers/trg_prevent_excessive_diners.sql)

<img width="1396" height="567" alt="צילום מסך 2026-05-29 173554" src="https://github.com/user-attachments/assets/446d994e-037d-4408-a779-e54a673eecbc" />

📜 [RunTrigger2](phase4/RunTriggers/test_trg_prevent_excessive_diners.sql)

<img width="1399" height="550" alt="צילום מסך 2026-05-29 173934" src="https://github.com/user-attachments/assets/c885b99a-10e2-4930-a540-596fe42f4560" />

> **Capacity Rule Enforcement & Error Interception:**
> This log output demonstrates the core defensive gatekeeping capabilities of `trg_prevent_excessive_diners`. 
> 
> 1. **Immediate Interception:** When an application context fires a rogue DML request—attempting to register a mass reservation of 30 guests (violating our maximum business safety limit of 20)—the **`BEFORE INSERT`** trigger intercepts the operational stream immediately.
> 2. **Transaction Abortion:** The system checks the `NEW.num_of_people` property, stops execution from modifying the active table space, and forces a custom server-side error declaration (`SQL state: P0001`). This completely invalidates the injection attempt, keeping restaurant infrastructure capacity perfectly safe.

## Main Control Programs (Anonymous Blocks)

### Main Program 1: `main_program_analytics.sql`
* **Workflow Focus:** Automated Business Intelligence and Reactive Operations.
* **Orchestration Sequence:**
  1. **Function Execution:** Invokes the analytical function `fn_calculate_city_health_index` to assess the economic stability and performance threshold of a specific targeted market (e.g., city of *"Puyang"*).
  2. **Procedure Call:** Immediately sequences into the batch administrative procedure `pr_apply_strategic_discounts`. This processes the analytical scores across all registered rental companies, executing bulk price markdown DML operations where weak infrastructure scores are detected.

📜 [MainProgram1](phase4/MainPrograms/main_program_analytics.sql)

<img width="1353" height="768" alt="צילום מסך 2026-05-29 181348" src="https://github.com/user-attachments/assets/1e40dd48-10ff-4e11-ab2b-0060fd2ba5e4" />

<img width="1375" height="703" alt="צילום מסך 2026-05-29 181403" src="https://github.com/user-attachments/assets/f749a303-3ebd-46e5-bf5c-36e0c2eb1f9a" />

> **Orchestration Log Analysis:**
> The console registry block above demonstrates a flawless, fully-integrated compilation of our architectural components inside `main_program_analytics.sql`.
>
> 1. **Cross-Component Handshake:** The anonymous block initiated successfully. In **Step 1**, it safely queried our standalone analytical engine (`fn_calculate_city_health_index`) to return an isolated performance baseline of `50/100` for the city of *"Puyang"*.
> 2. **High-Volume Transaction Automation:** In **Step 2**, the program invoked the stored procedure `pr_apply_strategic_discounts`. The internal explicit cursor evaluated multiple global markets, skipping highly stable environments while performing automated batch DML updates across weaker sectors (successfully calculating indexes and updating 29, 47, and 23 assets simultaneously).
> 3. **Fault-Tolerant Exception Interception:** When the workflow reached *Company 21* in *"Tulyushka"*, the 10% promotional reduction attempted to drop a vehicle rate below the systemic baseline limit. The backend schema immediately enforced data security via the `chk_min_price_threshold` rule. Instead of triggering an unhandled fatal environment crash, the procedure’s embedded **`EXCEPTION` clause** successfully intercepted the runtime violation, safely isolated the fault, and allowed the orchestrator to gracefully output the complete operational success sequence (`MAIN PROGRAM 1 COMPLETED SUCCESSFULLY`).

### 2. Main Program 2: `main_program_operations.sql`
* **Workflow Focus:** Customer-Centric Operations and Dynamic Data Streaming.
* **Orchestration Sequence:**
  1. **Procedure Call:** Coordinates cross-domain client scheduling by executing `pr_book_integrated_package`. This safely inserts synchronized reservation lines across both the vehicle rental registries and the restaurant dining registries under an isolated transaction.
  2. **Function Execution:** Accesses the customer ledger by calling the Ref Cursor function `fn_get_tourist_activity`. The main program loops through the active memory address, fetches the combined historical interactions row-by-row, and outputs real-time auditing metrics to evaluate financial activity.

📜 [MainProgram2](phase4/MainPrograms/main_program_operations.sql)


<img width="1401" height="790" alt="צילום מסך 2026-05-29 181752" src="https://github.com/user-attachments/assets/11274635-d5d6-42a6-b5e3-18f3e0a71ae5" />

<img width="1417" height="754" alt="צילום מסך 2026-05-29 181802" src="https://github.com/user-attachments/assets/55e31171-113b-4fd0-abb1-5d28fb483e6a" />

> **Dynamic Integration & Cursor Streaming Proof:**
> This continuous console stream validates the complete multi-tier execution of `main_program_operations.sql`.
>
> 1. **Transactional Multi-DML Pipeline:** The program successfully initiated **Step 1**, calling `pr_book_integrated_package` which processed synchronized inserts concurrently across the distinct schema environments (`car_booking` ID 20023 and `rest_booking` ID 20002).
> 2. **Live Event Trigger Interception:** Because the generated vehicle package price calculated to $800.00 (bypassing the $500 ceiling), the row-level listener `trg_sync_vip_tourist_status` intercepted the transaction pipeline mid-execution, firing a VIP ecosystem synchronization warning before successfully committing the data layer.
> 3. **Ref Cursor Extraction Framework:** In **Step 2**, the runtime coordinates shifted to the function layer, fetching the active pipeline address from `fn_get_tourist_activity`. The program effectively cycled through the shared **`REFCURSOR`** memory state, streaming consolidated cross-sector history (Cleanliness, Food, Service) and auditing aggregated financial metrics for *Tourist ID 1* seamlessly.

---

# Phase 5: Full Stack Web Application Integration

## Introduction
This final phase introduces a fully functional, end-to-end Web Application interface for the **Drive & Dine (Rent Cars & Restaurants Integrated System)**. 
The application transitions the system from raw SQL terminal interactions into an intuitive, visually stunning graphical user interface (GUI). It allows tourists to seamlessly book cars and reserve restaurant tables, while providing administrators with powerful tools to manage the database and generate business analytics.

---

## Architecture & Tools Used

The application was built using a modern JavaScript/TypeScript stack, carefully separating the client interface from the database logic.

### 1. Frontend (Client-Side)
* **Framework:** React (v19) with TypeScript.
* **Styling:** Tailwind CSS, utilizing a premium "Glassmorphism" aesthetic with deep black, gold, and frosted glass elements.
* **Animations:** Framer Motion (`motion`) for smooth page transitions and interactive micro-animations.
* **Build Tool:** Vite, for lightning-fast development and hot-module replacement.
* **Structure:** A Single Page Application (SPA) utilizing state-based routing to seamlessly transition between Home, Catalog, User History, Admin CRUD, and Business Insights screens.

### 2. Backend (Server-Side)
* **Environment:** Node.js with Express.js.
* **Role:** Acts as the REST API middleware, securely bridging the React frontend and the PostgreSQL database.
* **Endpoints:** Exposes dynamic routes (`/api/tables/:tableName`) for generic CRUD operations, as well as specialized routes (`/api/queries`, `/api/functions`, `/api/procedures`) to trigger the advanced PL/pgSQL logic developed in Phase 4.

### 3. Database
* **System:** PostgreSQL.
* **Driver:** `pg` (node-postgres) module.
* **Integration:** The backend securely connects to `IntegratedDB` and utilizes the existing schemas, views, triggers, and functions without altering the core data structures built in previous phases.

---

## How to Run the Application

To run the full stack application locally on your machine, you must run both the backend server and the frontend client simultaneously.

### Prerequisites
* **Node.js** installed on your machine.
* **PostgreSQL** running locally with the `IntegratedDB` database fully populated (as per Phases 1-4).

### Step 1: Start the Backend Server
Open your terminal, navigate to the `phase5/front` folder, and start the Express API server:
```bash
cd phase5/front
npm install
npm run server
```
*The backend server will initialize and listen for database requests on port 5000.*

### Step 2: Start the Frontend React Application
Open a **new** terminal window, navigate to the same `front` directory, and start the Vite development server:
```bash
cd phase5/front
npm run dev
```
*The frontend application will launch. Open your browser and navigate to `http://localhost:3000` to use the app.*

---

## Application Walkthrough & Screens

### 1. Authentication & User Registration
A secure entry point that identifies returning tourists or seamlessly registers new users. When a new user logs in, the application automatically triggers an `INSERT` statement to add their profile into the `tourist` database table, ensuring their history, bookings, and preferences are permanently tracked.

<img width="956" height="490" alt="image" src="https://github.com/user-attachments/assets/acd9ad2c-8809-4112-9fd5-01e8ddd20607" />

<img width="632" height="104" alt="image" src="https://github.com/user-attachments/assets/1e74b7b1-a548-416b-8b6c-5a229f06b6c3" />


### 2. Home Page & Search Interface
The main entry point for tourists. Users can switch between searching for luxury vehicles or fine dining, setting their desired pickup locations, cities, and dates.

<img width="958" height="494" alt="צילום מסך 2026-06-14 211636" src="https://github.com/user-attachments/assets/8ae6304f-8359-4367-88a6-a4d344b7307a" />


<img width="956" height="496" alt="צילום מסך 2026-06-14 211931" src="https://github.com/user-attachments/assets/7a5c363d-7e70-495b-9b48-53c448175dfb" />

### 3. Inventory Catalog
Displays the available rental cars and restaurants based on the user's search criteria. Features dynamic image rendering and interactive selection cards.

<img width="956" height="491" alt="image" src="https://github.com/user-attachments/assets/729faaf7-61ec-4c29-b9e3-d591c587d702" />

<img width="958" height="496" alt="image" src="https://github.com/user-attachments/assets/781b94a6-d409-43ae-b79c-509c451e5b49" />

### 4. Checkout & Booking
A smooth, integrated booking experience where users review their selected asset, provide necessary details (like the number of guests), and finalize their reservation securely.

<img width="956" height="493" alt="image" src="https://github.com/user-attachments/assets/9fca2890-f4fa-4e7b-9e9e-e3dac6f61976" />

<img width="957" height="482" alt="image" src="https://github.com/user-attachments/assets/c293eef6-725f-41ff-9f40-2abf9174ad1d" />

### 5. Personal Dashboard & History
A dynamic, personalized view for the logged-in tourist. This screen executes complex relational queries to fetch and display the user's past and upcoming car rentals and restaurant reservations. Whenever a user makes a new booking via the checkout, it is immediately inserted into the database and reflected here in real-time.

<img width="958" height="491" alt="image" src="https://github.com/user-attachments/assets/ae26991c-ab0e-4649-a6b8-491532f51a90" />


### 6. Interactive Review System
Allows tourists to leave detailed feedback and numerical ratings for their completed trips or dinners directly from their history panel. The inputs are dynamically inserted into the `review` and `rating` tables in the database, which actively influence the overarching popularity statistics of companies and restaurants.

<img width="953" height="440" alt="image" src="https://github.com/user-attachments/assets/2f89a860-c6c3-4105-81a3-fe3efd3bbc98" />

<img width="958" height="491" alt="image" src="https://github.com/user-attachments/assets/6d77a5d0-a748-4560-8be3-f8c7708c8a4c" />

<img width="611" height="187" alt="image" src="https://github.com/user-attachments/assets/4b43fd80-3e67-43a1-939a-3f57a110a8e5" />


### 7. Admin CRUD Interface
An exclusive, dynamic control panel for system administrators. It automatically reads the database schemas and provides a form-based interface to perform Create, Read, Update, and Delete operations on any table in the system without writing SQL.

<img width="959" height="493" alt="image" src="https://github.com/user-attachments/assets/accf8510-40d5-4cdf-9f67-2aef480c092e" />

<img width="958" height="495" alt="image" src="https://github.com/user-attachments/assets/2302bc8a-ac2e-41c3-a504-31c8bfa67151" />

<img width="956" height="493" alt="image" src="https://github.com/user-attachments/assets/769ccaa6-a92e-4bfc-9dc9-c5f3eec4bbd7" />

<img width="955" height="488" alt="image" src="https://github.com/user-attachments/assets/d761a93d-65ab-4962-ada0-a76c6e3132a4" />


### 8. Business Insights (Analytics & Routines)
A powerful administrative dashboard connected directly to the PL/pgSQL logic and the Queries.
* **Queries:** View available cars in Jerusalem and high-rated vehicles.
* **Functions:** Calculate the city performance index and stream tourist activity logs (Cursors).
* **Procedures:** 
  * Execute the `pr_apply_strategic_discounts` procedure to dynamically update prices with the click of a button.
  * Execute the `pr_book_integrated_package` procedure via a dedicated form to seamlessly book a unified package (Car + Restaurant) in a single transaction directly from the dashboard.

<img width="958" height="491" alt="image" src="https://github.com/user-attachments/assets/6e2d4288-e256-4baf-a64f-8f2255efd6e2" />

<img width="958" height="440" alt="image" src="https://github.com/user-attachments/assets/a145793a-a3bd-4bc5-ace6-bdbd023ba2af" />
