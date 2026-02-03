// Storage module for CRUD operations with users, tasks, and session management

export const storage = {

    // ------------------ User Management ------------------

    // Save a new user to the db

    async saveUser(user) {
        await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
    },

    // Get all users from the db

    async getUsers() {
        try {
            const data = await fetch("http://localhost:3000/users");
            const users = await data.json();
            return users || []; // Return empty array if no users
        } catch (error) {
            // Display warning message if server fails

            warningMsg.textContent = "Error connecting to server";
            console.error("Error loading users:", error);
        }
    },

    // Update only the atributtes you send it

    async updateUser(user) {
        await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user })
        });
    },

    // Update only the tasks array of a user
    async updateUserTasks(userId, tasks) {
        await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks }) // Send only updated tasks
        });
    },

    // ------------------ Task Management ------------------

    // Add a new task to a user's tasks array and save to backend
    async saveTask(user, task) {
        user.tasks = user.tasks || []; // Ensure tasks array exists
        user.tasks.push(task); // Add new task
        await this.updateUserTasks(user.id, user.tasks); // Persist changes
    },

    // Get all tasks of a user
    getTask(user) {
        if (!user) return []; // Return empty array if user not defined
        return user.tasks || [];
    },

    // Update a specific task 
    async updateTask(user, taskId, updates) {
        const task = user.tasks.find(task => task.id === taskId);
        if (!task) return; // Exit if task not found

        // Apply all updates from the updates object
        for (const key in updates) {
            task[key] = updates[key];
        }

        await this.updateUserTasks(user.id, user.tasks); // Persist changes
    },

    // Delete a task 
    async deleteTask(user, taskId) {
        user.tasks = user.tasks.filter(task => task.id !== taskId);
        await this.updateUserTasks(user.id, user.tasks); // Persist changes
    },

    // ------------------ Session Management ------------------

    // Save current user session in localStorage

    saveSession(session) {
        localStorage.setItem("actual_user", JSON.stringify(session));
    },

    // Get the current session from localStorage

    getSession() {
        const session = localStorage.getItem("actual_user");
        return session ? JSON.parse(session) : null;
    },

    // Clear the current session

    clearSession() {
        localStorage.removeItem("actual_user");
    },

};