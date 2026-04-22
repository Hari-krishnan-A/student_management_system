# Student Management System

A simple web-based Student Management System built using Node.js, Express, MySQL, HTML, CSS, and JavaScript. This project allows administrators to manage student records with basic CRUD operations.

---

## Features

* Admin login authentication
* Add new student records
* View student details
* Update student information
* Delete student records
* Store marks for 6 subjects and calculate total and average

---

## Tech Stack

Frontend:

* HTML
* CSS
* JavaScript

Backend:

* Node.js
* Express.js

Database:

* MySQL

---

## Project Structure

```
DBMS Project/
│
├── backend/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── dashboard.html
│
└── .gitignore
```

---

## Setup Instructions

1. Clone the repository

```
git clone https://github.com/your-username/student_management_system.git
cd student_management_system
```

2. Install backend dependencies

```
cd backend
npm install
```

3. Configure Database

* Create a MySQL database named:

```
student_management
```

* Create required tables (Students, Users, etc.)

* Update database credentials in:

```
backend/db.js
```

Example:

```
host: "localhost",
user: "root",
password: "your_password",
database: "student_management"
```

4. Run the backend server

```
node server.js
```

5. Open frontend

Open the following file in a browser:

```
frontend/index.html
```

##

---

## Future Improvements

* Add student login system
* Improve UI/UX
* Add search and filtering
* Deploy the application

---

## Author

HariKrishnan

---

## License

This project is for educational purposes.
