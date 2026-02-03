# CRUDTASK – JavaScript Module 3

## Project Overview

This project is a performance assessment for **Module 3 – JavaScript**.
The goal is to develop a web application called **CRUDTASK** for **academic task management**, where regular users can manage their own tasks and profiles, and administrators can oversee system activity and manage all tasks.

The application implements **simulated user authentication, role-based access control, protected routes, session persistence**, and **CRUD operations** using a **fake API powered by JSON Server**.

The focus of this project is on **JavaScript logic, role handling, and correct application flow**, rather than advanced backend development or deployment.

---

## Technologies Used

- HTML5
- CSS3 with Tailwind framework 
- Vanilla JavaScript (ES6+)
- JSON Server (fake API)
- LocalStorage
- Figma (UI designs reference)

---

## Application Roles

The system supports two types of users:

### User

- Can register, log in, and manage their own tasks.
- Can view, create, edit, and delete tasks assigned to them.
- Can mark tasks as `pending`, `in progress`, or `completed`.
- Can view and edit their own profile.
- Access restricted to user-specific views only.

### Administrator

- Can log in through the same form and is redirected to the admin dashboard.
- Can view, edit, delete, and change the status of **all tasks** in the system.
- Has full access to admin-only views.

**Business Rule:** Users with the `user` role cannot access admin views, and admins do not use user-specific views.

---

## Core Features

### 1. Authentication System

- User registration with automatic role assignment (`user`).
- User login with credential validation against JSON Server.
- Role-based route protection to restrict access.
- Redirect logic depending on authentication state.

### 2. Session Persistence

- Session stored in **LocalStorage**.
- Session remains active after page reload.
- Users without active sessions are redirected to the login page.

### 3. Task Management

- List, create, edit, and delete tasks.
- Task status can be changed (`pending`, `in progress`, `completed`).
- Users can only see and manage their own tasks.
- Admins can manage all tasks.

### 4. Dashboard (Admin)

- Provides task management functionality for all users.

### 5. User Profile

- View personal information.
- Shows total tasks, in progress tasks, completed tasks, and pending tasks metrics.
- Logout functionality.

### 6. Data Consistency

- All CRUD operations are synchronized with JSON Server.
- Role validation ensures secure access to data.
- Users cannot manipulate data directly in the browser without proper validation.

---

## Views

| View                    |
| ----------------------- |
| Login                   |
| Register                |
| Task Management (User)  |
| Admin Dashboard         |

### Route Logic

- Unauthenticated users attempting protected routes are redirected to `/login`.
- Authenticated users attempting `/login` or `/register` are redirected to their corresponding dashboard.
- Role-based access is enforced on all routes.

---

## Project Structure (Example)

```
/crudtask
│
├── index.html
├── register.html
├── tasks.html
├── admin-dashboard.html
├── profile.html
├── js/
│   ├── login.js
│   ├── register.js
│   ├── tasks.js
│   ├── admin-dashboard.js
│   └── storage.js
│
├── db.json
└── README.md
```

---

## Database (JSON Server)

The project uses **JSON Server** to simulate an API.

### Example Entities

- Users
- Tasks
- Some system Metrics

A default administrator user can be included in `db.json`.

---

## How to Run the Project

### 1. Install Dependencies

```bash
npm install
```

### 2. Start JSON Server

```bash
npx json-server db.json --port 3000
```

### 3. Open the Application

Open `index.html` using a local server.

---

## Figma Design Reference

The visual design and component structure are defined in Figma: *https://www.figma.com/design/K3PmKIOlfEsjnbwP54Yc2x/Sin-t%C3%ADtulo?node-id=33-2&p=f&t=BkA2w6ByLyc1C4TH-0*

---

## Author Information

- **Name:** Ulith Giraldo
- **Clan:** Turing

---

## Links

- **Github Repo:** *https://github.com/UlithG18/M3-DT*

---