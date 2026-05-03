from flask import Blueprint, request, jsonify
from utils.db import get_db

task = Blueprint("task", __name__)


# =========================
# CREATE / ASSIGN TASK
# =========================
@task.route("/tasks", methods=["POST"])
def create_task():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tasks 
        (title, description, status, assigned_to, assigned_by, project_id, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["title"],
        data["description"],
        "Pending",
        data["assigned_to"],
        data["assigned_by"],   # 🔥 NEW
        data["project_id"],
        data["due_date"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Task created successfully"})

# =========================
# GET ALL TASKS (ADMIN)
# =========================
@task.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_db()
    cursor = conn.cursor()

    tasks = cursor.execute("""
        SELECT 
            t.*, 
            u1.name as assigned_to_name,
            u2.name as assigned_by_name
        FROM tasks t
        LEFT JOIN users u1 ON t.assigned_to = u1.id
        LEFT JOIN users u2 ON t.assigned_by = u2.id
    """).fetchall()

    return jsonify([dict(t) for t in tasks])
# =========================
# GET TASKS BY USER (EMPLOYEE)
# =========================
@task.route("/tasks/user/<int:user_id>", methods=["GET"])
def get_user_tasks(user_id):
    conn = get_db()
    cursor = conn.cursor()

    try:
        tasks = cursor.execute(
            "SELECT * FROM tasks WHERE assigned_to=?",
            (user_id,)
        ).fetchall()

        return jsonify([dict(t) for t in tasks])

    except Exception as e:
        return jsonify({"message": str(e)}), 500

    finally:
        conn.close()


# =========================
# UPDATE TASK STATUS
# =========================
@task.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE tasks 
            SET status=?, issue_reason=? 
            WHERE id=?
        """, (
            data.get("status"),
            data.get("issue_reason", ""),
            id
        ))

        conn.commit()

        return jsonify({"message": "Task updated successfully"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500

    finally:
        conn.close()


# =========================
# DASHBOARD DATA
# =========================
@task.route("/dashboard", methods=["GET"])
def dashboard():
    conn = get_db()
    cursor = conn.cursor()

    try:
        total = cursor.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
        completed = cursor.execute(
            "SELECT COUNT(*) FROM tasks WHERE status='Completed'"
        ).fetchone()[0]
        pending = cursor.execute(
            "SELECT COUNT(*) FROM tasks WHERE status='Pending'"
        ).fetchone()[0]

        return jsonify({
            "total_tasks": total,
            "completed_tasks": completed,
            "pending_tasks": pending
        })

    except Exception as e:
        return jsonify({"message": str(e)}), 500

    finally:
        conn.close()