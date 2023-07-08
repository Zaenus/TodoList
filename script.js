const inputField = document.querySelector(".input-field textarea");
const todoList = document.querySelector(".todolist");
const pendingNum = document.querySelector(".pending-num");
const clearButton = document.querySelector(".clear-button");
const calendarShow = document.querySelector(".wrapper");
const calendar = document.querySelector(".calendar-icon");

let tasks = [];

function allTasks() {
  let pendingTasks = document.querySelectorAll(".pending");
  pendingNum.textContent = pendingTasks.length === 0 ? "no" : pendingTasks.length;

  let allLists = document.querySelectorAll(".list");
  if (allLists.length > 0) {
    todoList.style.marginTop = "20px";
    clearButton.style.pointerEvents = "auto";
    return;
  }
  todoList.style.marginTop = "0px";
  clearButton.style.pointerEvents = "none";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      const liTag = `<li class="list ${task.completed ? "" : "pending"}" onclick="handleStatus(this)">
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="task">${task.description}</span>
        <i class="uil uil-trash" onclick="deleteTask(this)"></i>
      </li>`;
      todoList.insertAdjacentHTML("beforeend", liTag);
    });
  }
  allTasks();

  const selectedDate = getSelectedDate();
  displayTasks(selectedDate);
}

inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim();

  if (e.key === "Enter" && inputVal.length > 0) {
    const selectedDate = getSelectedDate();

    const task = {
      description: inputVal,
      completed: false,
      date: selectedDate,
    };

    tasks.push(task);
    saveTasks();

    const liTag = `<li class="list pending" onclick="handleStatus(this)">
      <input type="checkbox">
      <span class="task">${task.description}</span>
      <i class="uil uil-trash" onclick="deleteTask(this)"></i>
    </li>`;

    todoList.insertAdjacentHTML("beforeend", liTag);
    inputField.value = "";
    allTasks();

    displayTasks(selectedDate);
  }
});

function handleStatus(e) {
  const checkbox = e.querySelector("input");
  checkbox.checked = !checkbox.checked;

  const taskIndex = Array.from(todoList.children).indexOf(e);
  const selectedDate = getSelectedDate();

  if (selectedDate) {
    tasks.filter((task) => task.date === selectedDate)[taskIndex].completed = checkbox.checked;
  } else {
    tasks[taskIndex].completed = checkbox.checked;
  }
  saveTasks();

  e.classList.toggle("pending");
  allTasks();
}

function deleteTask(e) {
  const taskItem = e.parentElement;
  const taskIndex = Array.from(todoList.children).indexOf(taskItem);
  const selectedDate = getSelectedDate();

  if (selectedDate === null) {
    tasks.splice(taskIndex, 1);
  } else {
    const filteredTasks = tasks.filter((task) => task.date === selectedDate);
    const taskIndexInFiltered = tasks.indexOf(filteredTasks[taskIndex]);
    tasks.splice(taskIndexInFiltered, 1);
  }

  saveTasks();

  taskItem.remove();
  allTasks();
}

clearButton.addEventListener("click", () => {
  todoList.innerHTML = "";
  tasks = [];
  saveTasks();
  allTasks();
});

let displayCalendar = localStorage.getItem("display");

// Set the initial display state of the calendarShow element based on the "display" value
if (displayCalendar === "on") {
  calendarShow.style.display = "block";
} else {
  calendarShow.style.display = "none";
}

// Add a click event listener to the calendar element
calendar.addEventListener("click", () => {
  // Check if the calendarShow element is currently displayed
  if (calendarShow.style.display === "block") {
    // If it is displayed, hide it and update the "display" value in local storage to "off"
    calendarShow.style.display = "none";
    localStorage.setItem("display", "off");
  } else {
    // If it is not displayed, show it and update the "display" value in local storage to "on"
    calendarShow.style.display = "block";
    localStorage.setItem("display", "on");
  }
});

// Load tasks from local storage on page load
loadTasks();

function getSelectedDate() {
  const selectedDateInput = document.querySelector(".calendar .day.active");
  if (selectedDateInput) {
    return selectedDateInput.getAttribute("data-date");
  } else {
    return new Date().toISOString().split("T")[0]; // Return the current date in "YYYY-MM-DD" format
  }
}

function displayTasks() {
  const selectedDate = getSelectedDate();

  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  const todoList = document.querySelector(".todolist");
  todoList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const liTag = `<li class="list ${task.completed ? "" : "pending"}" onclick="handleStatus(this)">
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="task">${task.description}</span>
      <i class="uil uil-trash" onclick="deleteTask(this)"></i>
    </li>`;
    todoList.insertAdjacentHTML("beforeend", liTag);
  });

  allTasks();
}
