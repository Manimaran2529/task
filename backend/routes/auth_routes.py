from flask import Blueprint, request, jsonify
from utils.db import get_db

auth = Blueprint("auth", __name__)


# =========================
# SIGNUP
# =========================
@auth.route("/signup", methods=["POST"])
def signup():
    data = request.json

    # Basic validation
    if not data.get("name") or not data.get("email") or not data.get("password") or not data.get("role"):
        return jsonify({"message": "All fields are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        # Check if user already exists
        existing_user = cursor.execute(
            "SELECT * FROM users WHERE email=?",
            (data["email"],)
        ).fetchone()

        if existing_user:
            return jsonify({"message": "User already exists"}), 400

        # Insert new user
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (data["name"], data["email"], data["password"], data["role"])
        )

        conn.commit()

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

    finally:
        conn.close()   # ✅ always close connection


# =========================
# LOGIN
# =========================
@auth.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        user = cursor.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (data["email"], data["password"])
        ).fetchone()

        if user:
            return jsonify({
                "message": "Login success",
                "user": dict(user)
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

    finally:
        conn.close()   # ✅ important


@auth.route("/users", methods=["GET"])
def get_users():
    conn = get_db()
    cursor = conn.cursor()

    users = cursor.execute(
        "SELECT id, name, email, role FROM users"
    ).fetchall()

    return jsonify([dict(u) for u in users])

