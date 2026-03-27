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

🔗 https://ai.studio/apps/0398fed9-b445-44e4-9e85-60cfa2ea6518  



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

(Add screenshot here)

---
