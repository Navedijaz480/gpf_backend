# GPF Backend - Farmer Manager API

A comprehensive backend service for managing farmer sales, flock data, and poultry house metrics.

## 🚀 Features

- **Authentication**: Secure JWT-based registration and login.
- **Sales Management**: Record and track sales transactions including weight, rate, and total amount.
- **Real-time Summaries**: Today's sales, last 7 days summary, and flock/house-wise analytics.
- **Metadata Management**: Quick access to vehicle history, active flocks, and houses.

## 🛠️ Tech Stack

- **Node.js** & **Express**
- **MongoDB** (via Mongoose)
- **JWT** (JSON Web Tokens)
- **CORS** enabled

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gpf_backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server**:
   ```bash
   # Production mode
   npm start

   # Development mode (if nodemon is installed)
   npm run dev
   ```

## 📖 API Documentation

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user (`username`, `email`, `password`) |
| POST | `/api/auth/login` | Login and receive a JWT token (`email`, `password`) |

### Sales
*All sales endpoints require an `Authorization: <token>` header.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/sales` | Create a new sale entry |
| GET | `/api/sales` | Get all sales for the logged-in user |
| GET | `/api/sales/summary` | Get 7-day sales summary |
| GET | `/api/sales/today` | Get today's sales |
| GET | `/api/sales/flock-summary` | Get summary grouped by flock |
| GET | `/api/sales/house-summary` | Get summary grouped by house |

### Metadata
*All meta endpoints require an `Authorization: <token>` header.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/meta/current` | Get latest rate, flock, and house info |
| GET | `/api/meta/vehicles` | Get list of unique vehicle numbers |
| GET | `/api/meta/brokers` | Get list of unique brokers |
| GET | `/api/meta/houses` | Get unique house numbers |
| GET | `/api/meta/flocks` | Get unique flock numbers |
| GET | `/api/meta/vehicle-history/:vehicleNo` | Get last 10 weight records for a vehicle |

## 📦 Postman Collection
You can find the Postman collection in the root directory: `gpf_backend.postman_collection.json`. Import it into Postman to test the APIs immediately.

---
Developed for Farmer Manager Application.
