from flask import Flask
from flask_cors import CORS
import os

# Routes
from routes.auth_routes import auth
from routes.project_routes import project
from routes.task_routes import task

# DB
from utils.db import get_db

# ================= APP =================
app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(auth)
app.register_blueprint(project)
app.register_blueprint(task)


# ================= HOME =================
@app.route("/")
def home():
    return {"message": "Backend is running 🚀"}


# ================= CREATE TABLES =================
def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        created_by INTEGER
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        status TEXT,
        assigned_to INTEGER,
        assigned_by INTEGER,
        project_id INTEGER,
        due_date TEXT,
        issue_reason TEXT
    )
    """)

    conn.commit()
    conn.close()


# 🔥 IMPORTANT: RUN ALWAYS (FOR DEPLOY)
create_tables()


# ================= RUN =================
