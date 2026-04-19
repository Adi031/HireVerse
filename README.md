# 🚀 HireVerse – Full Stack Job & Internship Portal

A full-stack Job and Internship Portal built as a capstone project using **Spring Boot 3** (backend) and **React + Vite** (frontend).

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Running](#setup--running)
- [Default Credentials](#default-credentials)
- [API Documentation](#api-documentation)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2.5, Spring Security (JWT) |
| Database | MySQL 8.x |
| Frontend | React 18, Vite, Bootstrap 5 |
| Auth | JWT (stateless) with Role-Based Access Control |
| API Docs | Springdoc OpenAPI (Swagger UI) |

---

## ✨ Features

### For Candidates
- Register, login, and maintain a professional profile
- Browse and search jobs/internships with type and keyword filters
- Apply with a cover letter and track application status live

### For Recruiters
- Post, edit, and delete job/internship listings
- View and manage applicants per listing
- Move candidates through the hiring pipeline (Shortlist → Interview → Hire/Reject)
- Manage company profile

### For Admins
- Platform-wide stats (users, jobs, applications)
- Ban/unban users
- View and manage all job listings

---

## 📁 Project Structure

```
HireVerse/
├── backend/          # Spring Boot application
│   └── src/main/
│       ├── java/com/jobportal/
│       │   ├── config/        # Security, CORS, DataInitializer
│       │   ├── controller/    # REST endpoints
│       │   ├── service/       # Business logic layer
│       │   ├── repository/    # JPA repositories
│       │   ├── entity/        # JPA entities
│       │   ├── dto/           # Request/Response DTOs
│       │   ├── enums/         # Role, ListingStatus, etc.
│       │   ├── exception/     # GlobalExceptionHandler
│       │   └── security/      # JWT filter, util, config
│       └── resources/
│           ├── application.properties
│           └── application-dev.properties  ← your local DB config
└── frontend/         # React + Vite application
    └── src/
        ├── components/   # Navbar, Footer, JobCard
        ├── context/      # AuthContext (JWT + user state)
        ├── pages/        # All page components
        └── api/          # Axios instance with interceptor
```

---

## 📦 Prerequisites

Make sure you have these installed:
- **Java 17** (JDK)
- **Maven 3.8+** (or use IntelliJ's built-in Maven)
- **MySQL 8.x** (running locally)
- **Node.js 18+** and **npm**
- **IntelliJ IDEA** (recommended for backend)

---

## 🚀 Setup & Running

### 1. Database Setup

Open **MySQL Workbench** (or any MySQL client) and run:

```sql
CREATE DATABASE job_portal_db;
```

That's it — Spring Boot will auto-create all tables on first run.

---

### 2. Backend Configuration

Create the file `backend/src/main/resources/application-dev.properties` with your local credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000
```

> ⚠️ **Never commit `application-dev.properties` to Git!** It is already in `.gitignore`.

The `application.properties` file (committed to Git) contains only placeholder values and activates the `dev` profile:
```properties
spring.profiles.active=dev
```

---

### 3. Run the Backend

**Option A — IntelliJ IDEA:**
1. Open the `backend/` folder as a Maven project
2. Run `BackendApplication.java` (the main class)

**Option B — Maven command line:**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The backend starts on **http://localhost:8080**

On first startup, `DataInitializer` automatically seeds:
- 10 job categories
- A default admin account (see credentials below)

---

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@jobportal.com | Admin@1234 |
| Candidate | Register a new account | - |
| Recruiter | Register a new account | - |

---

## 📖 API Documentation

Once the backend is running, visit:

👉 **http://localhost:8080/swagger-ui/index.html**

This auto-generated Swagger UI lists all available endpoints, request/response schemas, and lets you test the API directly in the browser.

---

## 🔐 Security Notes

- All passwords are **BCrypt-hashed** — never stored in plaintext
- JWT tokens expire after **24 hours**
- Role-based access control enforced at both URL and method level
- Admin endpoint returns a `UserResponse` DTO — **never** the raw entity with password hash

---

## 📊 Application Status Pipeline

```
APPLIED → SHORTLISTED → INTERVIEW → HIRED
                                  ↘ REJECTED
```

Candidates can withdraw an `APPLIED` application. Once it progresses, it cannot be withdrawn.

---

*Built with ❤️ using Spring Boot 3 & React 18*
