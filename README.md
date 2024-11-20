# User Management System

A comprehensive User Management application built with **Angular** for the frontend and **Node.js**, **Express.js**, **MongoDB**, and **TypeScript** for the backend. This application enables Create, Read, Update, and Delete (CRUD) operations for managing users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [Directory Structure](#directory-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

---

## Features

- User CRUD operations (Create, Read, Update, Delete).
- Fully responsive frontend built with **Angular**.
- Secure backend using **Node.js** and **Express.js**.
- Persistent data storage with **MongoDB**.
- Written in **TypeScript** for type safety.

---

## Technologies Used

### Frontend

- **Angular CLI**: Version 18.2.1
- **TypeScript**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **TypeScript**

---

## Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **Angular CLI** (version 18.2.1)
- **MongoDB** (local or cloud instance)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Akhildas2/User_Management_Curd_App.git
cd user-management
```

2. Install dependencies for the frontend:

```bash
cd frontend
npm install
```

3. Install dependencies for the backend:

```bash
cd ../backend
npm install
```

### Running the Application

#### Frontend

1. Navigate to the `frontend` directory:

```bash
   cd frontend
```

2. Start the development server:

```bash
ng serve
```

3. Open your browser and go to: http://localhost:4200

#### Backend

1. Navigate to the `backend` directory:

```bash
   cd backend
```

2. Start the development server:

```bash
npm run dev
```

3. The backend will run on: http://localhost:3000

---

## Scripts

### Frontend

- Development Server: ng serve
- Build: ng build
- Generate Component: ng generate component component-name

### Backend

- Start Server: npm run dev

---

## Directory Structure

```bash
user-management/
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
---

```

## API Endpoints

Base URL: `http://localhost:3000/api`

- **GET /api/users**: List all users
- **GET /api/users/:id**: Get user by ID
- **POST /api/users**: Create new user
- **PUT /api/users/:id**: Update existing user
- **DELETE /api/users/:id**: Delete user

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature-name
```

3. Commit your changes:

```bash
git commit -m "Add feature"
```

4. Push the branch:

```bash
git push origin feature-name
```

5. Open a Pull Request.

