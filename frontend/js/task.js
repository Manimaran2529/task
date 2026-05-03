let allTasks = [];

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    loadTasks();
    loadEmployeeDropdown();
});


/* ================= LOAD TASKS ================= */
async function loadTasks() {
    const taskList = document.getElementById("taskList");

    try {
        taskList.innerHTML = "<p>Loading tasks...</p>";

        const res = await fetch("http://127.0.0.1:5000/tasks");
        const data = await res.json();

        allTasks = data || [];

        renderTasks(allTasks);

    } catch (err) {
        console.error("Task load error:", err);
        taskList.innerHTML = "<p style='color:red;'>Failed to load tasks ❌</p>";
    }
}


/* ================= RENDER TASKS ================= */
function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");

    let html = "";

    if (!tasks || tasks.length === 0) {
        html = "<p>No tasks available ❗</p>";
    } else {
        tasks.forEach(task => {

            const status = task.status || "Pending";
            const statusClass = status.toLowerCase();

            html += `
            <div class="task-card">
                <h3>${task.title}</h3>

                <p class="task-desc">${task.description || ""}</p>

                <div class="task-row">
                    <span>Status:</span>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </div>

                <div class="task-row">
                    <span>Due:</span>
                    <span>${task.due_date || "-"}</span>
                </div>

                <div class="task-row">
                    <span>Assigned To:</span>
                    <span>${task.assigned_to_name || "-"}</span>
                </div>

                <div class="task-row">
                    <span>Assigned By:</span>
                    <span>${task.assigned_by_name || "Admin"}</span>
                </div>
            </div>
            `;
        });
    }

    taskList.innerHTML = html;
}


/* ================= CREATE TASK ================= */
window.createTask = async function () {

    const user = JSON.parse(localStorage.getItem("user"));

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDesc").value.trim();
    const due_date = document.getElementById("taskDue").value;
    const assignType = document.getElementById("assignType").value;
    const selectedUser = document.getElementById("employeeSelect").value;

    if (!title) {
        alert("Enter title ❗");
        return;
    }

    if (assignType === "one" && !selectedUser) {
        alert("Select employee ❗");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:5000/users");
        const users = await res.json();

        if (assignType === "all") {
            for (let u of users) {
                if (u.role === "member") {
                    await sendTask(u.id);
                }
            }
        } else {
            await sendTask(selectedUser);
        }

        alert("Task Created ✅");

        // 🔥 Clear form
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDesc").value = "";
        document.getElementById("taskDue").value = "";

        loadTasks();

    } catch (err) {
        console.error("Create task error:", err);
        alert("Error creating task ❌");
    }


    async function sendTask(empId) {
        await fetch("http://127.0.0.1:5000/tasks", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title,
                description,
                assigned_to: empId,
                assigned_by: user.id,
                project_id: 1,
                due_date
            })
        });
    }
};


/* ================= LOAD EMPLOYEE ================= */
async function loadEmployeeDropdown() {
    try {
        const res = await fetch("http://127.0.0.1:5000/users");
        const users = await res.json();

        let options = `<option value="">Select Employee</option>`;

        users.forEach(u => {
            if (u.role === "member") {
                options += `<option value="${u.id}">${u.name}</option>`;
            }
        });

        const dropdown = document.getElementById("employeeSelect");
        if (dropdown) dropdown.innerHTML = options;

    } catch (err) {
        console.error("Dropdown error:", err);
    }
}


/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}