# Course Booking API

A RESTful API for an online course booking platform where users can browse courses, enroll in courses, and administrators can manage course offerings.

---

# Project Overview

This Course Booking API is a backend application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides endpoints for user authentication, course management, and enrollment while implementing role-based authorization.

The API follows RESTful principles and uses JSON Web Tokens (JWT) for authentication.

---

# Features

## User Features

- User Registration
- User Login
- JWT Authentication
- Check duplicate emails
- Retrieve User Details
- Update User Details
- View Available Courses
- Enroll in Courses
- View Enrolled Courses

## Admin Features

- Create Courses
- Update Courses
- View All Users
- Change Role of Users
- View All Courses
- Manage Course Availability

---

# Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt

### Other Packages

- dotenv
- cors
- mongoose

---

# Project Structure

```
course-booking-api/
│
├── controllers/
├── models/
├── routes/
├── uploads/
├── auth.js
├── .env
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/daisyriedelacruz/course_booking_api.git
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file.

```env
PORT=4000

MONGODB_STRING=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret_key

```

## Start Server

```bash
node index.js
```

---

# Authentication

Protected routes require a JWT access token.

Example Header

```
Authorization: Bearer <access_token>
```

---

# API Routes

---

## Authentication

### Register

```
POST /users/register
```

### Login

```
POST /users/login
```

---

## User Routes

### Retrieve Profile

```
GET /users/details
```

### Update Profile

```
PUT /users/profile
```

### Reset Password

```
PUT /users/reset-password
```

---

## Course Routes

### Get All Courses

```
GET /courses/all
```

### Get All Active Courses

```
GET /courses
```

### Get Specific Course

```
GET /courses/specific/:courseId
```

### Add Course (Admin)

```
POST /courses
```

### Update Course (Admin)

```
PUT /courses/:courseId
```

### Archive Course (Admin)

```
PATCH /courses/:courseId/archive
```

### Activate Course (Admin)

```
PATCH /courses/:courseId/activate
```

### Search Course by Name

```
GET /courses/seaarch
```

### Search Course by Price

```
GET /courses//search-by-price"
```

---

## Enrollment Routes

### Enroll in Course

```
POST /users/enroll
```

### View User Enrollments

```
GET /users/get-enrollments
```

---

# Sample Request

Register

```json
POST /users/register

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@email.com",
    "password": "Password123",
    "mobileNo": "09123456789"
}
```

---

# Test Credentials

## Admin

```
Email:
admin@mail.com

Password:
admin123
```

---

## User

```
Email:
user@mail.com

Password:
user123
```

---

# Database Models

## User

```
firstName
lastName
email
password
isAdmin
mobileNo
```

---

## Course

```
name
description
schedule
price
isActive
createdOn
```

---

## Enrollment

```
userId
enrolledCourses
totalPrice
enrolledOn
status
```

---

# Testing

You may test the API using Postman

---

# Validation

The API validates:

- Required fields
- Email format
- Password length
- Phone number length
- Duplicate emails
- Existing course IDs
- JWT authentication
- Admin authorization

---

# Future Improvements

- Email Verification
- Course Categories
- Pagination
- File Uploads
- Ratings & Reviews
- Payment Integration
- Certificates
- Notifications

---

This project is intended for educational purposes.

---
