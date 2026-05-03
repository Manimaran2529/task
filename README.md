🚀 Team Task Manager (Full Stack)

🌐 Live Application

- 🔹 Frontend (Netlify):
  https://ornate-pastelito-5e2536.netlify.app

- 🔹 Backend (Railway):
  https://task-production-eb7d.up.railway.app

---

📌 Project Overview

This is a Full Stack Team Task Manager Web Application where users can:

- Create projects
- Assign tasks
- Track task progress
- Access features based on roles (Admin / Member)

---

✨ Features

🔐 Authentication

- Signup
- Login
- Role-based access (Admin / Member)

📁 Project Management

- Create projects
- View project list

✅ Task Management

- Create tasks
- Assign tasks to members
- Update task status

📊 Dashboard

- View all tasks
- Track status (Pending / Completed / Overdue)

---

🛠️ Tech Stack

Frontend

- HTML
- CSS
- JavaScript

Backend

- Python (Flask)
- Flask-CORS

Database

- SQLite

Deployment

- Frontend → Netlify
- Backend → Railway

---

🔗 API Endpoints

Auth

- "POST /signup"
- "POST /login"
- "GET /users"

Project

- "POST /projects"
- "GET /projects"

Task

- "POST /tasks"
- "GET /tasks"
- "PUT /tasks/:id"

---

⚙️ How to Run Locally

1️⃣ Clone Repository

git clone https://github.com/your-username/task-manager.git
cd task-manager

2️⃣ Backend Setup

cd backend
pip install -r requirements.txt
python app.py

3️⃣ Frontend

- Open "index.html" in browser

---

📂 Project Structure

task-manager/
│
├── backend/
│   ├── routes/
│   ├── utils/
│   ├── app.py
│   ├── requirements.txt
│   └── database.db
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── employee.html
│   ├── css/
│   └── js/
│
└── README.md

---

⚠️ Important Notes

⚠️ Important Notes

- Backend is deployed on Railway
- Frontend is deployed on Netlify
- API is connected using live Railway URL
- No localhost is used in production