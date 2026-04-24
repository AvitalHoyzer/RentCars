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

 ### Complex SELECT Queries (Double Implementation)
For each query, two different approaches were implemented and compared for efficiency.

(The order in the screenshots may be different, but it's the same data between two query options.)

#### Query 1: Find Available Cars in Jerusalem
Description: שליפת כל הרכבים הזמינים להשכרה בעיר ירושלים עבור דף החיפוש הראשי.

Approach A (JOIN): Standard and readable.

Approach B (EXISTS): Often faster as it stops at the first match found in the subquery.

Efficiency Analysis: EXISTS is more efficient for "existence" checks because it stops at the first match (Short-circuit), whereas JOIN creates a temporary table of all matches before filtering.

📜 [Query1](phase2/Queries.sql)

<img width="1496" height="761" alt="צילום מסך 2026-04-24 162203" src="https://github.com/user-attachments/assets/091177a4-8d50-43ba-934d-b1abfef3904f" />
<img width="1487" height="784" alt="צילום מסך 2026-04-24 162346" src="https://github.com/user-attachments/assets/7715877a-58a1-483a-bd9c-e66dde0a6669" />


#### Query 2: Loyal Customers (5+ Bookings in 2026)
Description: זיהוי תיירים שביצעו יותר מ-5 הזמנות במהלך שנת 2026 עבור תוכנית נאמנות.

Approach A (JOIN & HAVING): Required if we want to display the actual count.

Approach B (IN with Subquery): Efficient for simple membership filtering.

Efficiency Analysis: JOIN is better if the GUI needs to display the total_bookings count. IN can be optimized by the engine when only the identity of the tourist is needed.

[Query2](phase2/Queries.sql)

<img width="1495" height="790" alt="צילום מסך 2026-04-24 162643" src="https://github.com/user-attachments/assets/9c43d7cb-32e5-4c9c-977b-7eccd42d3718" />
<img width="1479" height="790" alt="צילום מסך 2026-04-24 162627" src="https://github.com/user-attachments/assets/91402e7d-3f19-4e80-98e7-2e8c24517fe8" />

#### Query 3: Recommended Cars (Rating 4+)
Description: שליפת רכבים שזכו לדירוג ממוצע של 4 ומעלה עבור מסך "רכבים מומלצים".

Approach A (Double JOIN & HAVING): Direct approach.

Approach B (Subquery in FROM): Pre-calculates averages.

Efficiency Analysis: Approach B can be more efficient if the subquery significantly reduces the number of rows (by grouping reviews) before joining with the larger CAR table.

📜 [Query3](phase2/Queries.sql)

<img width="1088" height="783" alt="צילום מסך 2026-04-24 163144" src="https://github.com/user-attachments/assets/b3d74d6d-49b6-4320-bbf1-2e330f9aa71c" />
<img width="1139" height="804" alt="צילום מסך 2026-04-24 163123" src="https://github.com/user-attachments/assets/ea911ca0-e3ad-463b-9b90-0e5a4af35eae" />


#### Query 4: Top 3 Most Booked Cars in 2026
Description: הצגת שלושת הרכבים המבוקשים ביותר (הכי הרבה הזמנות) בשנת 2026.

Approach A (JOIN & GROUP BY): Simplest implementation.

Approach B (Subquery in FROM): Aggregates data before joining.

Efficiency Analysis: Approach B is faster when the BOOKING table is massive, as it reduces the join complexity by summarizing the IDs first.

📜 [Query4](phase2/Queries.sql)

<img width="1472" height="781" alt="צילום מסך 2026-04-24 163459" src="https://github.com/user-attachments/assets/aeb3f95e-781f-423c-9d44-7f9ed10be1e0" />
<img width="1298" height="766" alt="צילום מסך 2026-04-24 163431" src="https://github.com/user-attachments/assets/290f1c4e-39df-44bd-8895-36a8adcd9b1b" />


### Additional SELECT Queries
---

#### Query 5: Personal Booking History
Description: היסטוריית הזמנות מפורטת עבור תייר ספציפי (למסך "הזמנות שלי"). משתמש ב-LEFT JOIN כדי להציג הזמנות גם אם טרם הושארה להן ביקורת.

📜 [Query5](phase2/Queries.sql)

<img width="1426" height="761" alt="צילום מסך 2026-04-24 163642" src="https://github.com/user-attachments/assets/57caf8c0-62bc-441a-910c-2f8019c148a4" />


#### Query 6: Monthly Revenue Report 2026
Description: דוח הכנסות חודשי מפורט עבור שנת 2026, כולל כמות השכרות וסך הכנסה חודשית.

📜 [Query6](phase2/Queries.sql)

<img width="1189" height="800" alt="צילום מסך 2026-04-24 163744" src="https://github.com/user-attachments/assets/d13a7a75-e733-4d36-a552-1f157cdc2972" />

#### Query 7: Top 3 most popular pickup locations
Description: זיהוי הערים שבהן מתבצעות הכי הרבה השכרות כדי לדעת איפה כדאי להגדיל את צי הרכבים.

📜 [Query7](phase2/Queries.sql)

<img width="893" height="758" alt="צילום מסך 2026-04-24 164059" src="https://github.com/user-attachments/assets/699be3f7-5da5-45f1-aef1-e0fba216ba38" />

#### Query 8: Most recommended rental company (Highest average rating)
Description: שליפת החברה בעלת ממוצע הדירוגים הגבוה ביותר (בתנאי שיש לה לפחות 2 ביקורות כדי להבטיח אמינות).

📜 [Query8](phase2/Queries.sql)

<img width="1225" height="776" alt="צילום מסך 2026-04-24 164242" src="https://github.com/user-attachments/assets/b2d94798-62c6-4f4a-a723-e3ab8f281c3f" />

#### Query 9: Budget-friendly cars (Price <= 70) with location details
Description: סינון רכבים שמחירם היומי נמוך מ-70, כולל הצגת שם החברה והעיר שבה הם נמצאים.

📜 [Query9](phase2/Queries.sql)

<img width="1141" height="822" alt="צילום מסך 2026-04-24 164326" src="https://github.com/user-attachments/assets/035bd7b1-fd14-459c-8fcd-43847b0944f4" />

---

### UPDATE & DELETE Operations

#### Update 1: Seasonal Price Hike (SUV)
* **Description:** העלאת מחיר יומית ב-10% לכל רכבי ה-SUV לטובת עונת השיא.

<img width="1479" height="764" alt="צילום מסך 2026-04-24 171311" src="https://github.com/user-attachments/assets/d7e7e449-f956-4418-b253-a1843bd9be62" />

<img width="1491" height="771" alt="צילום מסך 2026-04-24 171355" src="https://github.com/user-attachments/assets/378451c8-ae0e-4675-8e92-12f13aa6ac51" />

#### Update 2: Auto-cancel Expired Bookings
* **Description:** עדכון סטטוס ל'מבוטל' עבור הזמנות שמועד האיסוף שלהן עבר והן טרם התחילו.

<img width="1490" height="774" alt="צילום מסך 2026-04-24 172045" src="https://github.com/user-attachments/assets/07296779-2fa6-4f7d-9c9d-935e323ca67e" />

<img width="960" height="407" alt="צילום מסך 2026-04-24 172111" src="https://github.com/user-attachments/assets/7b771a70-c862-4f87-98e3-8ce9f6af151f" />

<img width="1494" height="702" alt="צילום מסך 2026-04-24 172150" src="https://github.com/user-attachments/assets/ad2a4a9c-0183-4cb4-9a0a-c2f8b63e51c0" />

#### Update 3: Update company contact information
* **Description:** עדכון פרטי קשר – עדכון מספר הטלפון של חברת 'Hertz' במערכת הניהול.

<img width="1180" height="441" alt="צילום מסך 2026-04-24 172556" src="https://github.com/user-attachments/assets/b12d5869-aace-4c9d-af14-46de0bd9137d" />

<img width="1098" height="529" alt="צילום מסך 2026-04-24 172627" src="https://github.com/user-attachments/assets/91dda945-48aa-4271-bfe8-9c231314b502" />

#### Delete 1: Remove Low-Quality Reviews
* **Description:** ניקוי נתונים – מחיקת ביקורות עם דירוג 1 כוכבים שאינן כוללות תגובה טקסטואלית, כדי לשמור על דאטה איכותי.

<img width="1329" height="771" alt="צילום מסך 2026-04-24 173659" src="https://github.com/user-attachments/assets/796ebd40-6a4a-4f01-b21e-a9d8648e7239" />

<img width="989" height="528" alt="צילום מסך 2026-04-24 173721" src="https://github.com/user-attachments/assets/520b9d11-2853-4008-a4f0-18027c061171" />

#### Delete 2: Decommission Old Vehicles
* **Description:** רענון צי הרכבים – מחיקת רכבים משנת 2002 ומטה, בתנאי שהם אינם מושכרים כרגע (סטטוס שונה מ-'Rented').
  
<img width="1483" height="744" alt="צילום מסך 2026-04-24 174758" src="https://github.com/user-attachments/assets/c35531df-186a-4f3b-b3eb-1ae2b9607d0b" />

<img width="1438" height="771" alt="צילום מסך 2026-04-24 174904" src="https://github.com/user-attachments/assets/dd7bad11-e2c1-4e97-939d-ee299fd5165e" />


The Challenge (Foreign Key Violation):
Initially, a simple DELETE command failed because of Referential Integrity. In our database schema, the CAR table is linked to the BOOKING table via a Foreign Key (car_id). PostgreSQL prevents the deletion of a car if there are existing booking records associated with it. Deleting such a car would leave "orphaned" bookings, breaking the data consistency.

The Solution:
To resolve this without deleting important historical booking data, we updated the query to include a subquery using the NOT IN operator.

#### Delete 3: Remove Inactive Locations
* **Description:** תחזוקת מיקומים – מחיקת מיקומים (ערים) שאינם מקושרים לאף סניף של חברת השכרה.

  









