from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth
from routes.project_routes import project
from routes.task_routes import task
from utils.db import get_db

app = Flask(__name__)
CORS(app)

# Register with prefix
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(project, url_prefix="/api")
app.register_blueprint(task, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "Backend is running 🚀"}

def create_tables():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, email TEXT UNIQUE, password TEXT, role TEXT)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, created_by INTEGER)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, description TEXT, status TEXT,
        assigned_to INTEGER, assigned_by INTEGER,
        project_id INTEGER, due_date TEXT, issue_reason TEXT)""")
    conn.commit()
    conn.close()

# ✅ safe init
@app.before_first_request
def init_db_once():
    create_tables()