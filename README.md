# Zorvyn Finance Backend

A backend system for a finance dashboard that supports financial record management, role-based access control, and summary analytics. Built with Node.js, Express, and MongoDB.

---

## Live API

Base URL: `https://zorvyn-backend-production-7830.up.railway.app`

Test it:
```
GET https://zorvyn-backend-production-7830.up.railway.app/
```

Returns:
```json
{ "message": "Zorvyn Finance API is running" }
```

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas) with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Deployment**: Railway

---

## Project Structure

```
zorvyn-backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, login logic
│   │   ├── userController.js        # User CRUD logic
│   │   ├── transactionController.js # Transaction CRUD + filtering
│   │   └── dashboardController.js   # Aggregation and summary logic
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── roleCheck.js             # Role-based access control
│   │   ├── validate.js              # Validation error handler
│   │   └── validators.js            # Request validation rules
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Transaction.js           # Transaction schema
│   └── routes/
│       ├── authRoutes.js            # Auth endpoints
│       ├── userRoutes.js            # User endpoints
│       ├── transactionRoutes.js     # Transaction endpoints
│       └── dashboardRoutes.js       # Dashboard endpoints
├── .env                             # Environment variables (not committed)
├── .gitignore
├── app.js                           # Entry point
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SKEL1NJA/zorvyn-backend.git
cd zorvyn-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## Authentication

The API uses JWT-based authentication. Include the token in all protected requests:

```
Authorization: Bearer <your_token>
```

Tokens are valid for 7 days.

---

## Role System

| Role | Permissions |
|------|-------------|
| **admin** | Full access — manage users, create/update/delete transactions, view dashboard |
| **analyst** | Create transactions, view all transactions, view dashboard |
| **viewer** | View transactions, view summary and recent activity only |

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get token |

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users` | Admin | Create a user |
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PUT | `/api/users/:id` | Admin | Update user role or status |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### Transactions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/transactions` | Admin, Analyst | Create a transaction |
| GET | `/api/transactions` | All roles | Get all transactions with filters |
| GET | `/api/transactions/:id` | All roles | Get transaction by ID |
| PUT | `/api/transactions/:id` | Admin | Update a transaction |
| DELETE | `/api/transactions/:id` | Admin | Delete a transaction |

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | All roles | Total income, expenses, net balance |
| GET | `/api/dashboard/categories` | Admin, Analyst | Category-wise totals |
| GET | `/api/dashboard/trends` | Admin, Analyst | Monthly income and expense trends |
| GET | `/api/dashboard/recent` | All roles | Last 5 transactions |

---

## Filtering Transactions

The `GET /api/transactions` endpoint supports the following query parameters:

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `type` | string | `income` | Filter by transaction type |
| `category` | string | `food` | Filter by category |
| `startDate` | date | `2026-03-01` | Filter from this date |
| `endDate` | date | `2026-03-31` | Filter until this date |
| `page` | number | `1` | Page number (default: 10) |
| `limit` | number | `10` | Results per page (default: 10) |

Example:
```
GET /api/transactions?type=expense&category=food&startDate=2026-03-01&endDate=2026-03-31
```

---

## Data Models

### User
```json
{
  "name": "Uday Admin",
  "email": "uday@zorvyn.com",
  "password": "hashed_password",
  "role": "admin | analyst | viewer",
  "isActive": true
}
```

### Transaction
```json
{
  "amount": 50000,
  "type": "income | expense",
  "category": "salary | freelance | investment | food | transport | utilities | entertainment | healthcare | other",
  "date": "2026-03-01",
  "notes": "March salary",
  "createdBy": "user_id"
}
```

---

## Assumptions Made

- The first admin user is created via `/api/auth/register` with `role: "admin"`. In production this would be seeded securely.
- Categories are predefined as enums to ensure data consistency for aggregation and reporting.
- Soft delete was not implemented — deleted records are permanently removed. This can be added with an `isDeleted` flag if needed.
- All monetary amounts are stored as plain numbers. In a production fintech system, amounts would be stored in the smallest currency unit (paise) as integers to avoid floating point precision issues.

---

## Tradeoffs Considered

- **MongoDB over SQL**: Chosen for flexibility in financial record schema and native support for aggregation pipelines which power the dashboard endpoints.
- **JWT over sessions**: Stateless auth suits a REST API better. Sessions would require server-side storage.
- **Mongoose over raw MongoDB driver**: Schema validation and middleware hooks (like password hashing) are cleaner with Mongoose at this scale.

---

## If I Had More Time

- Add unit and integration tests with Jest and Supertest
- Add rate limiting on auth endpoints to prevent brute force
- Add soft delete for transactions
- Add search support across transaction notes
- Containerize with Docker for easier deployment