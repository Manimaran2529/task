console.log("Dashboard Loaded");


/* ================= ROLE PROTECTION ================= */
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

// 🔥 IMPORTANT FIX
if (user.role?.toLowerCase().trim() !== "admin") {
    window.location.href = "employee.html";
}


/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {

    // Sidebar navigation
    document.getElementById("nav-dashboard")?.addEventListener("click", () => showSection("dashboard"));

    document.getElementById("nav-tasks")?.addEventListener("click", () => {
        showSection("tasks");

        if (typeof loadEmployeeDropdown === "function") {
            loadEmployeeDropdown();
        }

        if (typeof loadTasks === "function") {
            loadTasks();
        }
    });

    document.getElementById("nav-users")?.addEventListener("click", () => {
        showSection("users");
        loadUsers();
    });

    document.getElementById("nav-logout")?.addEventListener("click", logout);

    // Add employee
    document.getElementById("addBtn")?.addEventListener("click", addEmployee);

    // Default page
    showSection("dashboard");
    loadDashboard();
});


/* ================= NAVIGATION ================= */
function showSection(section) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.style.display = "none";
    });

    const el = document.getElementById(section);
    if (el) el.style.display = "block";
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}


/* ================= DASHBOARD ================= */
async function loadDashboard() {
    try {
        const res = await fetch("https://task-manager-backend-ct4g.onrender.com/dashboard");
        const data = await res.json();

        const total = document.getElementById("total");
        const completed = document.getElementById("completed");
        const pending = document.getElementById("pending");

        if (total) total.innerText = data.total_tasks || 0;
        if (completed) completed.innerText = data.completed_tasks || 0;
        if (pending) pending.innerText = data.pending_tasks || 0;

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}


/* ================= USERS ================= */
async function loadUsers() {
    try {
        const res = await fetch("https://task-manager-backend-ct4g.onrender.com/users");
        const data = await res.json();

        let html = "";

        data.forEach(u => {
            if (u.role === "member") {
                html += `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.name}</td>
                        <td>${u.email}</td>
                        <td><span class="badge">Active</span></td>
                    </tr>
                `;
            }
        });

        if (!html) {
            html = `<tr><td colspan="4">No employees found ❗</td></tr>`;
        }

        const table = document.getElementById("userList");
        if (table) table.innerHTML = html;

    } catch (err) {
        console.error("User load error:", err);
    }
}


/* ================= ADD EMPLOYEE ================= */
async function addEmployee() {

    const nameInput = document.getElementById("empName");
    const emailInput = document.getElementById("empEmail");
    const passwordInput = document.getElementById("empPassword");

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields ❗");
        return;
    }

    try {
        const res = await fetch("https://task-manager-backend-ct4g.onrender.com/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name,
                email,
                password,
                role: "member"
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Employee added successfully ✅");

            // clear fields
            nameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";

            loadUsers();
        } else {
            alert(data.message || "Error adding employee ❌");
        }

    } catch (err) {
        console.error("Add employee error:", err);
        alert("Server error ❌");
    }
}