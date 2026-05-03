/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    // 🔒 Not logged in
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // 🔥 ROLE PROTECTION (VERY IMPORTANT)
    if (user.role?.toLowerCase().trim() !== "member") {
        window.location.href = "dashboard.html";
        return;
    }

    // 👋 Welcome text
    const welcome = document.getElementById("welcomeText");
    if (welcome) {
        welcome.innerText = "Welcome " + user.name + " 👋";
    }

    // Logout button
    document.getElementById("nav-logout")?.addEventListener("click", logout);

    // Load tasks
    loadMyTasks();
});


/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}


/* ================= LOAD TASKS ================= */
async function loadMyTasks() {
    const taskList = document.getElementById("taskList");

    try {
        if (taskList) {
            taskList.innerHTML = "<p>Loading tasks...</p>";
        }

        const res = await fetch("https://task-manager-backend-ct4g.onrender.com/tasks");
        const tasks = await res.json();

        const user = JSON.parse(localStorage.getItem("user"));

        // 🔥 Safe comparison
        const myTasks = tasks.filter(t => String(t.assigned_to) === String(user.id));

        renderTasks(myTasks);

    } catch (err) {
        console.error("Load error:", err);

        if (taskList) {
            taskList.innerHTML =
                "<p style='color:red;'>Failed to load tasks ❌</p>";
        }
    }
}


/* ================= RENDER ================= */
function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");

    if (!taskList) return;

    let html = "";

    if (!tasks || tasks.length === 0) {
        html = "<p>No tasks assigned ❗</p>";
    } else {
        tasks.forEach(task => {

            const status = task.status || "Pending";

            const color =
                status === "Completed"
                    ? "#22c55e"
                    : status === "Issue"
                    ? "#ef4444"
                    : "#f59e0b";

            html += `
                <div class="task-card">
                    <h3>${task.title}</h3>
                    <p>${task.description || ""}</p>

                    <p>
                        Status:
                        <span style="color:${color}; font-weight:bold;">
                            ${status}
                        </span>
                    </p>

                    <p>Due: ${task.due_date || "N/A"}</p>

                    ${
                        status !== "Completed"
                        ? `
                        <div class="task-actions">
                            <button onclick="completeTask(${task.id})">✔ Complete</button>
                            <button onclick="reportIssue(${task.id})">⚠ Issue</button>
                        </div>
                        `
                        : `<p style="color:#22c55e;">✔ Completed</p>`
                    }
                </div>
            `;
        });
    }

    taskList.innerHTML = html;
}


/* ================= COMPLETE ================= */
window.completeTask = async function (id) {
    try {
        await fetch(`https://task-manager-backend-ct4g.onrender.com/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Completed" })
        });

        alert("Task completed ✅");
        loadMyTasks();

    } catch (err) {
        console.error("Complete error:", err);
        alert("Error completing task ❌");
    }
};


/* ================= ISSUE ================= */
window.reportIssue = async function (id) {
    const reason = prompt("Enter issue reason:");

    if (!reason || reason.trim() === "") {
        alert("Reason required ❗");
        return;
    }

    try {
        await fetch(`https://task-manager-backend-ct4g.onrender.com/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "Issue",
                issue_reason: reason
            })
        });

        alert("Issue reported ⚠️");
        loadMyTasks();

    } catch (err) {
        console.error("Issue error:", err);
        alert("Error reporting issue ❌");
    }
};