let isSignup = false;

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("actionBtn");
    if (btn) {
        btn.addEventListener("click", handleAction);
    }
});

/* ================= HANDLE BUTTON ================= */
function handleAction() {
    if (isSignup) {
        signup();
    } else {
        login();
    }
}

/* ================= TOGGLE ================= */
window.toggleForm = function () {
    isSignup = !isSignup;

    const name = document.getElementById("name");
    const role = document.getElementById("role");
    const title = document.getElementById("formTitle");
    const btn = document.getElementById("actionBtn");
    const toggleText = document.getElementById("toggleText");
    const msg = document.getElementById("msg");

    msg.innerText = "";

    if (isSignup) {
        name.style.display = "block";
        role.style.display = "block";

        title.innerText = "Signup ✨";
        btn.innerText = "Signup";

        toggleText.innerHTML =
            `Already have an account?
             <span onclick="toggleForm()">Login</span>`;
    } else {
        name.style.display = "none";
        role.style.display = "none";

        title.innerText = "Login 👋";
        btn.innerText = "Login";

        toggleText.innerHTML =
            `Don't have an account?
             <span onclick="toggleForm()">Signup</span>`;
    }
};

/* ================= SIGNUP ================= */
async function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    const msg = document.getElementById("msg");

    if (!name || !email || !password || !role) {
        msg.innerText = "Fill all fields ❗";
        return;
    }

    try {
        const res = await fetch("https://task-manager-backend-ct4g.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();

        if (res.ok) {
            msg.style.color = "lightgreen";
            msg.innerText = "Signup successful ✅";

            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("role").value = "";

            setTimeout(() => toggleForm(), 1000);

        } else {
            msg.innerText = data.message || "Signup failed ❌";
        }

    } catch (err) {
        console.error(err);
        msg.innerText = "Server error ❌";
    }
}

/* ================= LOGIN ================= */
async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const msg = document.getElementById("msg");

    if (!email || !password) {
        msg.innerText = "Enter email & password ❗";
        return;
    }

    try {
        console.log("Sending login request...");

        const res = await fetch("https://task-manager-backend-ct4g.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("Response:", data);

        if (res.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));

            const role = data.user.role?.toLowerCase().trim();

            if (role === "admin") {
                window.location.href = "dashboard.html";
            } else if (role === "member") {
                window.location.href = "employee.html";
            } else {
                msg.innerText = "Invalid role ❗";
            }

        } else {
            msg.innerText = data.message || "Invalid login ❌";
        }

    } catch (err) {
        console.error("Login error:", err);
        msg.innerText = "Server error ❌";
    }
}