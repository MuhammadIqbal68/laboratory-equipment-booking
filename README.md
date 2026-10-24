# Laboratory Equipment Booking System (LabBook)

A centralized full-stack web application designed for university laboratories where **students** can explore laboratory equipment, view availability schedules, and submit booking requests for their research, practical work, and academic projects, while **administrators** maintain the equipment catalog, track condition and quantities, and supervise booking requests.

---

## 1. Project Planning & Proposal

### Project Title
**Laboratory Equipment Booking System (LabBook)**

### Problem Addressed
In university science and engineering departments, laboratory equipment is often shared across dozens of courses, research groups, and hundreds of students. Traditional manual logbooks, spreadsheets, and verbal reservations frequently result in:
- Double-booking and conflicting reservations during peak practical weeks.
- Lack of visibility into equipment condition and availability.
- Inefficient administrative overhead for laboratory technicians.
- Difficulty tracking historical equipment usage for maintenance.

### Solution
**LabBook** provides a structured digital platform with automated conflict detection, role-based access control, real-time availability tracking, and transparent approval workflows.

### Main Features
- **Student Portal**:
  - Secure registration and login with bcrypt password hashing and JWT.
  - Interactive equipment catalog with search by keywords and filter by laboratory discipline.
  - Equipment availability status (real-time available units vs. total inventory).
  - Conflict-aware booking submission (specifying date, time slots, quantity, and academic purpose).
  - Student dashboard with booking statistics and status overview.
  - Personal booking history with cancellation of pending requests.
- **Administrator Console**:
  - Centralized overview with metrics (equipment count, pending reviews, active students).
  - Full CRUD equipment management (add, edit, update condition, delete).
  - Status management for student bookings (Approve, Reject with custom feedback, Complete).
  - Automatic inventory adjustments upon equipment approval.
- **Security & Integrity**:
  - Passwords hashed with bcrypt (salt rounds = 10).
  - JWT-based authentication with expiration and protected route guards.
  - Input validation and sanitization using express-validator.
  - Non-overlapping booking validation logic preventing over-allocation.

---

## 2. Technology Stack

### Frontend
- **React (v19)** with functional components and modern React hooks (`useState`, `useEffect`, `useReducer`, `useContext`).
- **React Router (v7)** for declarative routing and role-guarded routes (`ProtectedRoute`).
- **Axios** with request interceptors for automated JWT Bearer token injection and 401 handling.
- **Vanilla CSS Design System** featuring an elegant light-themed orange & white palette (`#F97316` primary accents, card surfaces, responsive grid system, and micro-animations).
- **React Icons** for intuitive visual cues.

### Backend
- **Node.js** runtime environment.
- **Express.js** REST API framework.
- **Mongoose ODM** with schema validation, custom hooks, and pre-save password hashing.
- **bcryptjs** for irreversible password encryption.
- **jsonwebtoken (JWT)** for stateless session tokens.
- **CORS** middleware for secure cross-origin communication.
- **express-validator** for comprehensive request body validation.

### Database
- **MongoDB / MongoDB Atlas**: Persistent NoSQL database.
- Integrated support for development and production cloud clusters.

---

## 3. Project Structure

```
final project/
├── client/                     # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios instance & REST API services
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Alert, Loader, Modal, StatusBadge
│   │   │   └── layout/         # Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext (React Context API)
│   │   ├── pages/              # Pages: Home, Login, Register, Catalog, Details, Dashboards
│   │   ├── utils/              # Formatting helpers and constants
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Orange & white design system CSS
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection with cloud & local fallback
│   ├── controllers/            # Auth, Equipment, Booking, Dashboard controllers
│   ├── middleware/             # JWT auth & error handling middleware
│   ├── models/                 # Mongoose models: User, Equipment, Booking
│   ├── routes/                 # Express API routes
│   ├── utils/                  # Input validation rules & sample seed data
│   ├── server.js               # Server entry point
│   ├── seed.js                 # Database seed script
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 4. REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve profile for authenticated user |

### Equipment Catalog (`/api/equipment`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/equipment` | Authenticated | Search, filter, and paginate equipment |
| `GET` | `/api/equipment/:id` | Authenticated | Retrieve detailed equipment information |
| `POST` | `/api/equipment` | Admin Only | Add new laboratory equipment |
| `PUT` | `/api/equipment/:id` | Admin Only | Update existing equipment record |
| `DELETE` | `/api/equipment/:id` | Admin Only | Delete equipment record |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Student | Submit equipment booking request |
| `GET` | `/api/bookings/my` | Student | Retrieve current student's bookings |
| `GET` | `/api/bookings` | Admin Only | Retrieve all student bookings |
| `GET` | `/api/bookings/:id` | Auth / Admin | Retrieve single booking record |
| `PATCH` | `/api/bookings/:id/status`| Admin Only | Approve, reject, or complete booking |
| `PATCH` | `/api/bookings/:id/cancel`| Student (Owner)| Cancel a pending booking request |

### Dashboards (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/student` | Student | Summary metrics and recent student bookings |
| `GET` | `/api/dashboard/admin` | Admin Only | Global metrics (equipment, requests, students) |

---

## 5. Getting Started (Installation & Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/)
- (Optional) [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### Step 1: Clone the repository
```bash
git clone https://github.com/<your-username>/lab-equipment-booking.git
cd lab-equipment-booking
```

### Step 2: Configure Environment Variables
Create a `.env` file in the `server` directory (based on `.env.example`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional: MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lab-booking?retryWrites=true&w=majority
```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 4: Seed Initial Data (Optional)
The system includes an automatic database seed with sample laboratory equipment and an initial administrator account:
```bash
npm run seed
```

**Default Credentials for Testing:**
- **Administrator**:
  - Email: `admin@lab.com`
  - Password: `admin123`
- **Student**:
  - Email: `student@university.ac.za`
  - Password: `student123`

### Step 5: Run the Application Locally

You can now run both the frontend and backend with a single command from the root directory:

```bash
# Install all dependencies (root, client, server)
npm run install:all

# Launch both Backend (port 5000) and Frontend (port 5173) concurrently:
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 6. Vercel Deployment Guide

This project includes pre-configured [`vercel.json`](file:///d:/DevSynt%20projects/final%20project/vercel.json) and [`api/index.js`](file:///d:/DevSynt%20projects/final%20project/api/index.js) so you can deploy the complete full-stack application (React frontend + Express serverless API) directly to Vercel in a few simple steps.

### Step-by-Step Vercel Deployment:

1. **Push to GitHub**:
   Push this project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Complete LabBook system with full admin features and Vercel config"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** > **"Project"**.
   - Select your GitHub repository.
   - **Root Directory**: Leave as `./` (default).

3. **Configure Environment Variables in Vercel**:
   In the **Environment Variables** section on Vercel, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/lab-booking?retryWrites=true&w=majority`)
   - `JWT_SECRET`: A secure string (e.g. `your_custom_production_jwt_secret_key_2026`)
   - `NODE_ENV`: `production`

   *(Note: If you haven't set up MongoDB Atlas yet, the backend automatically uses the built-in fast in-memory persistence store, allowing your demo on Vercel to work immediately!)*

4. **Deploy**:
   - Click **Deploy**.
   - Vercel will build the React frontend and deploy the Express API serverless routes automatically.
   - You will receive a live URL: `https://your-project.vercel.app`

---

## 7. License
This project is developed for academic purposes under the final-year capstone curriculum.
