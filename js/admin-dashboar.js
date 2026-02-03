// Import storage module for handling data persistence
import { storage } from "./storage.js";

// DOM elements
const editForm = document.getElementById("edit-task-form"); // Form used for editing tasks
const cancelBtn = document.getElementById("cancel-edit"); // Button to cancel editing
const logoutBtn = document.getElementById("logout"); // Logout button
const newTaskBtn = document.getElementById("new-task-btn")

// State variables
let editingTaskOwner = null; // Stores the user who owns the task being edited
let editingTaskId = null; // Stores the ID of the task being edited
let actualUser = null; // The currently logged-in user
let allUsers = []; // Array of all users
let tasks = []; // Array of all tasks combined from all users


// Tasks information
let totalTasks = document.getElementById("total-tasks")
let progressTasks = document.getElementById("progress-tasks")
let completedTasks = document.getElementById("completed-tasks")
let pendingTasks = document.getElementById("overall-progress")


// Check if there is a session
const sessionUser = storage.getSession();


    // If no user is logged in, redirect to the login page
if (!sessionUser) {
    window.location.href = "index.html";
}

if (sessionUser.role === "user") {
    window.location.href = "tasks.html"
}


// Initialize admin dashboard
async function initAdmin() {
    const users = await storage.getUsers(); // Fetch all users from storage
    actualUser = users.find(user => user.id === sessionUser.id); // Find the logged-in user

    // Redirect if user does not exist or is not an admin
    if (!actualUser || actualUser.role !== "admin") {
        window.location.href = "index.html";
        return;
    }

    allUsers = users; // Store all users
    loadAllTasks(); // Load all tasks to display

    // Display username in the UI
    const profileName = document.getElementById("profile-name");
    const profileProfess = document.getElementById("profile-profession")
    profileName.textContent = actualUser.username;
    profileProfess.textContent = actualUser.profession;

        // Tasks information

}

// Load all tasks from all users and keep track of the owner
function loadAllTasks() {
    tasks = [];
    allUsers.forEach(user => {
        // If user has tasks, combine them with their owner
        (user.tasks || []).forEach(task => {
            tasks.push({ task, owner: user });
        });
    });
    renderTasks(tasks); // Render all tasks in the UI
}

// Create a task card element for display
function createTaskCard(taskObj) {
    const { task, owner } = taskObj; // Extract task and owner

    // Create the card container
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
            <p>${owner.username}</p>
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
        </td>
        `;

    // Delete task on button click
    card.querySelector("#delete-btn").addEventListener("click", async () => {
        await storage.deleteTask(owner, task.id);
        loadAllTasks(); // Reload all tasks after deletion
    });

    // Edit task on button click
    card.querySelector("#edit-btn").addEventListener("click", () => {
        editingTaskId = task.id;
        editingTaskOwner = owner;

        // Pre-fill edit form with task details
        document.getElementById("edit-title").value = task.title;
        document.getElementById("edit-frequency").value = task.frequency;
        document.getElementById("edit-priority").value = task.priority;
        document.getElementById("edit-due-date").value = task.dueDate;

        // Show edit modal
        document.getElementById("edit-task-modal").className = "bg-gray-100 min-h-screen absolute inset-0 bg-black bg-opacity-60";
    });

    // Change status on button click
    card.querySelector("#status-btn").addEventListener("click", async () => {
        const nextStatus =
            task.status === "Pending"
                ? "In progress"
                : task.status === "In progress"
                    ? "Completed"
                    : "Pending";
        await storage.updateTask(owner, task.id, { status: nextStatus });
        loadAllTasks(); // Reload tasks to reflect status change
    });

    return card; // Return the created card element
}

// Render all task cards into their respective columns
function renderTasks(tasksArr) {

    const box = document.getElementById("tbody")
    box.innerHTML = ""; // Clear the box

    // Append each task card to the correct column
    tasksArr.forEach(taskObj => {
        box.appendChild(createTaskCard(taskObj));
    });
}

// Handle edit form submission
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingTaskId || !editingTaskOwner) return;

    // Get updated values from form
    const title = document.getElementById("edit-title").value.trim();
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;

    // Update task in storage
    await storage.updateTask(editingTaskOwner, editingTaskId, { title, frequency, priority });

    loadAllTasks(); // Reload all tasks with updates

    // Reset editing state and hide edit modal
    editingTaskId = null;
    editingTaskOwner = null;
    document.getElementById("edit-task-modal").className = "hidden";
});

// click new task
newTaskBtn.addEventListener("click", (e) => {
    document.getElementById("create-task-modal").className = "bg-gray-100 min-h-screen absolute inset-0 bg-black bg-opacity-60"
})

// Cancel edit
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editingTaskId = null;
    editingTaskOwner = null;
    document.getElementById("edit-task-modal").className = "hidden"; // Hide modal
});

// Logout functionality
logoutBtn.addEventListener("click", () => {
    storage.clearSession(); // Clear session
    window.location.href = "index.html"; // Redirect to login page
});

// Initialize the admin dashboard on page load
initAdmin();
