const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const errorMessage = document.getElementById("errorMessage");
const clearCompletedBtn = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(
    'input[name="taskFilter"]'
);

let tasks = [];
let nextTaskId = 1;
let currentFilter = "all";

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        errorMessage.textContent = "Please enter a task.";
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

    taskInput.value = "";
    errorMessage.textContent = "";

    renderTasks();
    taskInput.focus();
});

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

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            renderTasks();
        });

        // Add elements to the list item
        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCounter.textContent =
        remainingTasks +
        (remainingTasks === 1
            ? " remaining "
            : " remaining ");
}


// Handle filter selection
filterButtons.forEach(function (button) {
    button.addEventListener("change", function () {
        if (button.checked) {
            currentFilter = button.value;
            renderTasks();
        }
    });
});

// Clear all completed tasks
clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    renderTasks();
});

// Display the initial task list and counter
renderTasks();
