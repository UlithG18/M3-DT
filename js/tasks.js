// Import storage module for handling data persistence
import { storage } from "./storage.js";

// DOM elements
const editForm = document.getElementById("edit-task-form"); // Form used for editing tasks
const cancelBtn = document.getElementById("cancel-edit"); // Button to cancel editing
const logout = document.getElementById("logout"); // Logout button

// State variables
let editingTaskId = null; // Stores the ID of the task being edited
let actualUser = null; // The currently logged-in user
let tasks = []; // User-specific tasks array


// Tasks information
let totalTasks = document.getElementById("total-tasks")
let progressTasks = document.getElementById("progress-tasks")
let completedTasks = document.getElementById("completed-tasks")
let pendingTasks = document.getElementById("pending-tasks")


// Get the currently logged-in user session
const sessionUser = storage.getSession();

// Redirect if there is no session
if (!sessionUser) {
    window.location.href = "index.html";
}

if (sessionUser.role === "admin") {
    window.location.href = "admin-dashboard.html"
}

// ------------------ Initialization ------------------

async function init() {
    const users = await storage.getUsers();
    actualUser = users.find(user => user.id === sessionUser.id); // Find current user

    if (!actualUser) {
        storage.clearSession();
        window.location.href = "index.html"; // If user not found, redirect
    }

    tasks = actualUser.tasks || []; // Load the user's tasks
    renderTasks(tasks) // Render with current filters

    // Display username in the UI
    const profileName = document.getElementById("profile-name");
    const profileProfess = document.getElementById("profile-profession")
    profileName.textContent = actualUser.username;
    profileProfess.textContent = actualUser.profession;

    // Tasks information
    totalTasks.textContent = Object.keys(tasks).length
    progressTasks.textContent = tasks.filter(task => task.status === "In progress").length
    completedTasks.textContent = tasks.filter(task => task.status === "Completed").length
    pendingTasks.textContent = tasks.filter(task => task.status === "Pending").length
}


init();

// ------------------ DOM Elements for tasks Creation & Filters ------------------
const tasksForm = document.getElementById("tasks-form");
const taskTitle = document.getElementById("form-task-title");
const taskDes = document.getElementById("form-task-description");
const taskCategory = document.getElementById("form-task-category");
const taskFrequency = document.getElementById("form-task-frequency");
const taskPriority = document.getElementById("form-task-priority");
const taskDueDate = document.getElementById("form-task-due-date");
const newTaskBtn = document.getElementById("new-task-btn")

const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

// Filter and search state
let searchLetters = "";
let activeStatus = "all";
let activePriority = "all";

// click new task
newTaskBtn.addEventListener("click", (e) => {
    document.getElementById("create-task-modal").className = "bg-gray-100 min-h-screen absolute inset-0 bg-black bg-opacity-60"
})


// ------------------ Task Card Creation ------------------
function createTaskCard(task) {

    const card = document.createElement("tr");
    card.className = `border-t hover:bg-gray-50`;
    card.dataset.id = task.id;

    // Inner HTML of the card
    card.innerHTML =
        `<td class="px-6 py-4">
            <p>${task.title}</p>
            <p class="text-sm text-gray-600">${task.id}</p>
        </td>
        <td class="px-6 py-4">
            <p>${task.category}</p>
        </td>
        <td class="px-6 py-4">
            <p>${task.priority}</p>
        </td>
        <td class="px-6 py-4">
            <button id="status-btn">${task.status}</button>
        </td>
        <td class="px-6 py-4">
            <p>${task.dueDate}</p>
        </td>     
        <td class="px-6 py-4 text-center space-x-2">
            <button id="edit-btn" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
            <button id="delete-btn" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
        </td>`;

    // ------------------ Card Event Listeners ------------------

    // Delete task
    card.querySelector("#delete-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        await storage.deleteTask(actualUser, task.id); // Delete from storage
        tasks = storage.getTask(actualUser); // Refresh local tasks
        renderTasks(tasks); // Re-render with filters
    });


    // Edit task
    card.querySelector("#edit-btn").addEventListener("click", (e) => {
        e.preventDefault();
        editingTaskId = task.id;

        // Fill edit form with current task info
        document.getElementById("edit-title").value = task.title;
        document.getElementById("edit-frequency").value = task.frequency;
        document.getElementById("edit-priority").value = task.priority;
        document.getElementById("edit-due-date").value = task.dueDate;

        // Show edit modal
        document.getElementById("edit-task-modal").className = "bg-gray-100 min-h-screen absolute inset-0 bg-black bg-opacity-60";
    });


    // Update status
    card.querySelector("#status-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        const nextStatus =
            task.status === "Pending" ? "In progress" :
                task.status === "In progress" ? "Completed" :
                    "Pending";

        await storage.updateTask(actualUser, task.id, { status: nextStatus }); // Update storage
        task = storage.getTask(actualUser); // Refresh local tasks
        renderTasks(tasks); // Re-render
    });

    return card;
}

// ------------------ Task Creation ------------------
async function createTask(task) {
    await storage.saveTask(actualUser, task); // Save task in storage
    tasks = storage.getTask(actualUser); // Refresh local Tasks
    renderTasks(tasks); // Re-render
}

// ------------------ Render Tasks ------------------
function renderTasks(tasks) {
    const box = document.getElementById("tbody")
    box.innerHTML = ""; // Clear the box

    tasks.forEach(task => {
        const card = createTaskCard(task);
        box.appendChild(card);
    });
}

// // ------------------ Filters ------------------
// function activeFilters() {
//     const filtered = tasks.filter(task => {
//         const statusMatch = activeStatus === "all" || task.status === activeStatus;
//         const priorityMatch = activePriority === "all" || task.priority === activePriority;
//         return statusMatch && priorityMatch;
//     });

//     renderTasks(filtered);
// }

// function setStatusFilter(value) {
//     activeStatus = value;
//     activeFilters();
// }

// function setPriorityFilter(value) {
//     activePriority = value;
//     activeFilters();
// }

// ------------------ Event Listeners ------------------

// Submit new task
tasksForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        description: taskDes.value,
        category: taskCategory.value,
        frequency: taskFrequency.value,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        status: "Pending",
        createdat: Date.now().toLocaleString()
    };

    if (!task.title || !task.frequency || !task.priority || !task.dueDate) return; // Validate
    createTask(task); // Save task
    tasksForm.reset(); // Clear form
});

// Submit edit form
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingTaskId) return;

    const title = document.getElementById("edit-title").value.trim();
    const description = document.getElementById("edit-description").value;
    const category = document.getElementById("edit-category").value;
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;
    const dueDate = document.getElementById("edit-due-date").value;

    await storage.updateTask(actualUser, editingTaskId, { title, description, category, frequency, priority, dueDate });
    tasks = storage.getTask(actualUser);
    renderTasks(tasks);

    editingTaskId = null; // Reset edit
    document.getElementById("edit-task").className = "hidden"; // Hide modal
});

// Cancel edit
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editingTaskId = null;
    document.getElementById("edit-task").className = "hidden";
});

// // Filter change events
// statusFilter.addEventListener("change", () => setStatusFilter(e.target.value));
// priorityFilter.addEventListener("change", () => setPriorityFilter(e.target.value));

// Logout
logout.addEventListener("click", () => {
    storage.clearSession(); // Clear session
    window.location.href = "index.html"; // Redirect
});