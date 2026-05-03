from flask import Blueprint, request, jsonify
from utils.db import get_db

auth = Blueprint("auth", __name__)


# =========================
# SIGNUP
# =========================
@auth.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    # ✅ Validation
    if not data or not data.get("name") or not data.get("email") or not data.get("password") or not data.get("role"):
        return jsonify({"message": "All fields are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        # ✅ Check existing user
        existing_user = cursor.execute(
            "SELECT * FROM users WHERE email=?",
            (data["email"],)
        ).fetchone()

        if existing_user:
            return jsonify({"message": "User already exists"}), 400

        # ✅ Insert user
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (data["name"], data["email"], data["password"], data["role"].lower())
        )

        conn.commit()

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        print("Signup Error:", e)
        return jsonify({"message": "Server error"}), 500

    finally:
        conn.close()


# =========================
# LOGIN
# =========================
@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        print("LOGIN API CALLED:", data)  # 🔍 debug

        user = cursor.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (data["email"], data["password"])
        ).fetchone()

        print("USER FOUND:", user)  # 🔍 debug

        if user:
            # ✅ SAFE RESPONSE (NO dict(user))
            return jsonify({
                "message": "Login success",
                "user": {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2],
                    "role": user[4]
                }
            }), 200

        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        print("Login Error:", e)
        return jsonify({"message": "Server error"}), 500

    finally:
        conn.close()


# =========================
# GET USERS
# =========================
@auth.route("/users", methods=["GET"])
def get_users():
    conn = get_db()
    cursor = conn.cursor()

    try:
        users = cursor.execute(
            "SELECT id, name, email, role FROM users"
        ).fetchall()

        # ✅ Safe conversion
        result = []
        for u in users:
            result.append({
                "id": u[0],
                "name": u[1],
                "email": u[2],
                "role": u[3]
            })

        return jsonify(result)

    except Exception as e:
        print("Users Error:", e)
        return jsonify([]), 500

    finally:
        conn.close()