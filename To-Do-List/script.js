
/* Select HTML elements */
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const errorMessage = document.getElementById("errorMessage");
const clearCompletedBtn = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(
    'input[name="taskFilter"]'
);

/* Local Storage key */
const STORAGE_KEY = "todoTasks";

/* Application state */
let tasks = loadTasks();
let nextTaskId = getNextTaskId();
let currentFilter = "all";

/* Load saved tasks from Local Storage */
function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

/* Save tasks to Local Storage */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        // The application can continue without Local Storage.
    }
}

/* Generate the next task ID */
function getNextTaskId() {
    const ids = tasks.map(function (task) {
        return task.id;
    });

    return ids.length > 0
        ? Math.max.apply(null, ids) + 1
        : 1;
}

/* Add a new task */
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Prevent empty tasks and spaces-only input
    if (taskText === "") {
        errorMessage.textContent =
            "Please enter a task. Empty tasks or tasks with only spaces are not allowed.";

        taskInput.classList.add("is-invalid");
        taskInput.focus();
        return;
    }

    const task = {
        id: nextTaskId,
        text: taskText,
        completed: false
    };

    tasks.push(task);
    nextTaskId++;

    // Reset input and error message
    taskInput.value = "";
    errorMessage.textContent = "";
    taskInput.classList.remove("is-invalid");

    saveTasks();
    renderTasks();

    taskInput.focus();
});

/* Clear the validation message while typing */
taskInput.addEventListener("input", function () {
    errorMessage.textContent = "";
    taskInput.classList.remove("is-invalid");
});

/* Display tasks according to the selected filter */
function renderTasks() {
    taskList.replaceChildren();

    // Filter the tasks
    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Show a styled message when there are no tasks to display
    if (filteredTasks.length === 0) {
        let icon = "📝";
        let title = "No tasks yet!";
        let message = "Add your first task to get started.";

        if (tasks.length > 0) {
            if (currentFilter === "active") {
                icon = "🎉";
                title = "All caught up!";
                message = "You have completed all your tasks.";
            } else if (currentFilter === "completed") {
                icon = "✅";
                title = "No completed tasks";
                message = "Completed tasks will appear here.";
            }
        }

        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-state list-group-item";

        const emptyIcon = document.createElement("div");
        emptyIcon.className = "empty-state-icon";
        emptyIcon.textContent = icon;

        const emptyTitle = document.createElement("h5");
        emptyTitle.className = "empty-state-title";
        emptyTitle.textContent = title;

        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-state-message";
        emptyMessage.textContent = message;

        emptyItem.append(emptyIcon, emptyTitle, emptyMessage);
        taskList.appendChild(emptyItem);
    }

    // Create an HTML element for each task
    filteredTasks.forEach(function (task) {
        const listItem = document.createElement("li");

        listItem.className =
            "list-group-item d-flex align-items-center gap-3";

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input mt-0";
        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed: " + task.text
        );

        // Complete or reactivate the task
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
        });

        // Create task text
        const taskText = document.createElement("span");
        taskText.className = "task-text flex-grow-1";
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            "Delete task: " + task.text
        );

        // Delete only the selected task
        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        // Add elements to the list item
        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    // Update the number of incomplete tasks
    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCounter.textContent =
        remainingTasks +
        (remainingTasks === 1 ? " remaining" : " remaining");
}

/* Handle filter selection */
filterButtons.forEach(function (button) {
    button.addEventListener("change", function () {
        if (button.checked) {
            currentFilter = button.value;
            renderTasks();
        }
    });
});

/* Remove all completed tasks */
clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});

/* Display the initial task list and counter */
renderTasks();

