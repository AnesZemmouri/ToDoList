document.getElementById("start-btn").addEventListener("click", function () {
  window.location.href = "toDo.html";
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const taskList = document.getElementById("taskList");

  // Check if the task input is empty
  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  // Check if the date input is empty
  if (dateInput.value === "") {
    alert("Please enter a date!");
    return;
  }

  // Sanitize and prepare the input values
  const taskText = DOMPurify.sanitize(taskInput.value);
  const dueDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

  // Create a new list item
  const li = document.createElement("li");
  li.innerHTML = `
        <span>${taskText} <span class="task-date">(Due: ${dateInput.value})</span></span>
        <button class="delete-btn" onclick="this.parentElement.remove(); sortTasks();">Delete</button>
      `;
  li.setAttribute("data-date", dateInput.value);

  // Check if the due date is past today
  if (dueDate < today) {
    li.classList.add("past-deadline");
  }

  // Append the new task to the task list
  taskList.appendChild(li);
  sortTasks();

  // Clear input fields after adding the task
  taskInput.value = "";
  dateInput.value = "";
}

function sortTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = Array.from(taskList.getElementsByTagName("li"));

  // Sort tasks based on the due date
  tasks.sort((a, b) => {
    const dateA = new Date(a.getAttribute("data-date"));
    const dateB = new Date(b.getAttribute("data-date"));
    return dateA - dateB; // Sort in ascending order
  });

  // Re-append sorted tasks to the task list
  tasks.forEach((task) => taskList.appendChild(task));
}

// Update past deadlines every day
function updatePastDeadlines() {
  const tasks = document.querySelectorAll("#taskList li");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    const dueDate = new Date(task.getAttribute("data-date"));
    if (dueDate < today) {
      task.classList.add("past-deadline");
    } else {
      task.classList.remove("past-deadline");
    }
  });
}

// Check for past deadlines immediately on load
updatePastDeadlines();

// Set an interval to check past deadlines every day (86400000 ms)
setInterval(updatePastDeadlines, 86400000);
