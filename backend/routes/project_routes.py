from flask import Blueprint, request, jsonify
from utils.db import get_db

project = Blueprint("project", __name__)

# ✅ Create Project
@project.route("/projects", methods=["POST"])
def create_project():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO projects (name, created_by) VALUES (?, ?)",
        (data["name"], data["created_by"])
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Project created successfully"})


# ✅ Get All Projects
@project.route("/projects", methods=["GET"])
def get_projects():
    conn = get_db()
    cursor = conn.cursor()

    projects = cursor.execute("SELECT * FROM projects").fetchall()

    return jsonify([dict(p) for p in projects])