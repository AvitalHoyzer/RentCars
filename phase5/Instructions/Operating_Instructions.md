# Drive & Dine - System Operation Instructions (Phase 5)

Welcome to the full-stack web application for the Drive & Dine system.
Follow these steps to successfully run and operate the system locally on your machine.

---

## 1. Prerequisites
Before you begin, ensure you have the following installed and running:
* **Node.js** - Needed to run the server and frontend.
* **PostgreSQL** - Ensure the database `IntegratedDB` is actively running and populated with data from Phases 1-4.

---

## 2. Starting the Backend Server
The backend handles all connections to the database, queries, and procedures.

1. Open your terminal or command prompt.
2. Navigate to the `front` folder inside `phase5`:
   ```bash
   cd phase5/front
   ```
3. Install the required Node.js packages (only required the very first time):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run server
   ```
   *You should see a success message indicating the server is running on port 5000 and the database is connected.*

---

## 3. Starting the Frontend (React Interface)
The frontend provides the graphical user interface for tourists and administrators.

1. Open a **new, separate** terminal window.
2. Navigate to the same `front` folder:
   ```bash
   cd phase5/front
   ```
3. Start the Vite development environment:
   ```bash
   npm run dev
   ```
4. Open your web browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

---

## 4. How to Operate the System

### 🔑 Logging In & Registration
* The system features an automatic login/registration gateway.
* **Existing Users:** Enter the details of an existing tourist (from your database), and the system will retrieve your history.
* **New Users:** If you enter new details, the application will dynamically insert a new tourist record into the database and log you in.

### 🚗 Browsing & Booking
* **Home Page:** Choose whether you want to search for Cars or Restaurants. Enter your desired pickup/return cities and dates.
* **Catalog:** View available vehicles or dining options dynamically filtered by your search criteria.
* **Checkout:** Confirm your selection, enter guest details, and finalize the reservation. The system executes an `INSERT` statement to log the booking.

### 📜 Personal Dashboard & Reviews
* **History:** Click on "My History" to view a real-time list of your active and past reservations.
* **Leave Feedback:** For completed reservations, click the review button to leave text feedback and a 1-5 star rating. This directly updates the `review` and `rating` tables in the database.

### ⚙️ Admin & Business Insights
The system provides exclusive control panels for administrators:
* **Admin CRUD:** Read, add, update, or delete records from any table in the database using a simple form-based UI.
* **Business Insights:** 
  * Execute PL/pgSQL **Queries** to see available cars or highest-rated companies.
  * Run **Functions** (Cursors) to calculate the "City Health Index" or stream detailed tourist logs.
  * Run **Procedures** to apply strategic 10% discounts across companies, or book fully integrated vacation packages (car + restaurant) in a single unified database transaction.
