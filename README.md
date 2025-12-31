# 🧑‍💻 Mini User Management System

A full-stack **User Management System** built to manage user authentication, authorization, and role-based access control (RBAC).  
The application supports secure user registration, login, profile management, and admin-level user lifecycle operations such as activating and deactivating accounts.

This project was developed as part of a **48-hour Backend Developer Intern assessment**.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with **email, full name, and password**
- Secure password hashing using **bcrypt**
- JWT-based authentication
- Account status enforcement (inactive users cannot log in)
- Protected routes with authentication middleware
- Role-based access control (**admin / user**)

### 👤 User Features
- Login & logout
- View own profile
- Edit full name and email (modal-based UI)
- Change password with strength validation
- View last login timestamp

### 🛠️ Admin Features
- Admin-only dashboard
- View all users with pagination
- Activate / deactivate user accounts
- Role-restricted admin APIs

### 🧪 Testing
- Backend unit tests using **Jest + Supertest**
- Covers authentication, RBAC, inactive user login blocking, and business logic
- Uses in-memory MongoDB for isolated testing

---

## 🧰 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT
- bcryptjs
- Jest & Supertest

### Frontend
- React (Hooks)
- React Router v6
- Axios
- ## 📘 API Documentation



### 🔗 Postman Collection:  
## Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

## User
- GET `/api/users/me`
- PUT `/api/users/me`
- PUT `/api/users/me/password`

## Admin
- GET `/api/admin/users`
- PATCH `/api/admin/users/:id/activate`
- PATCH `/api/admin/users/:id/deactivate`


## Deployment
- Backend: https://mini-user-management-g39f.onrender.com
- Frontend: https://mini-user-management-frontend.onrender.com
- Database: MongoDB Atlas

