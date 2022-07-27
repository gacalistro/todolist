// VARIABLES =======================================
let list = JSON.parse(localStorage.getItem("tasks")) || [],
  timeoutNewSubTask = [],
  idCount = list.length === 0 ? 1 : list[0].id + 1,
  inputHasFocus;

const ul = document.querySelector("#mainUl");

class Task {
  constructor(id, task, check = false) {
    this.id = id;
    this.task = task;
    this.check = check;
  }
}

// UPDATES LIST ON HTML
updateListOnHtml();

// WINDOW EVENTS =======================================
// ADDS A TASK IF HAS SOMETHING WRITTEN CLICKING OUTSIDE THE INPUT
window.addEventListener("click", (event) => {
  if (document.activeElement == newTaskInput) {
    inputHasFocus = true;
    return;
  }

  if (inputHasFocus) {
    inputHasFocus = false;

    if (newTaskInput.value != "" && event.target == document.body) {
      addNewTask();
      return;
    }

    if (!/addNewTaskButton|addNewTaskImg|fixedAdd/.test(event.target.id)) {
      fixedAdd.click();
    }
  }
});

// ADDS A TASK WITH ENTER KEY
window.addEventListener("keydown", (event) => {
  if (document.activeElement.getAttribute("id") == "newTaskInput") {
    if (newTaskInput.value != "" && event.key == "Enter") {
      addNewTask();
    }
  }
});

// FUNCTIONS =======================================
// UPDATE LIST ON HTML
function updateListOnHtml() {
  ul.innerHTML = "";

  list.forEach((task) => {
    ul.innerHTML += `<li class="mainTask" id="t${task.id}">
      <input type="checkbox" onclick="markCheckbox(${task.id})" ${
      task.check ? "checked" : ""
    } />
      <span>${task.task}</span>
      
      
      <button onclick="removeTask(${task.id})">
      <img src="assets/delete.svg" alt="" />
      </button>

      <button onclick="editTask(${task.id})">
      <img src="assets/edit.svg" alt="" />
      </button>
        
      </li>`;
  });

  mainUlEmpty();
  updateSpanToBeClickable();
  showDeleteButton();
}

// IT SHOWS "Nothing yet." WHEN LIST IS EMPTY
function mainUlEmpty() {
  if (list.length > 0) {
    mainUlIsEmpty.classList.add("hidden");
  } else {
    mainUlIsEmpty.classList.remove("hidden");
  }
}

// ADD
function addNewTask() {
  let id = idCount++,
    task = new Task(id, newTaskInput.value);

  list.unshift(task);

  newTaskInput.value = "";

  updateLocalStorage();
  updateListOnHtml();
  showInputAddNewTask();
  inputHasFocus = false;
}

// EDIT
function editTask(taskId) {
  let span = document.querySelector(`#t${taskId} span`);

  showInputAddNewTask();
  newTaskInput.value = span.innerHTML;

  removeTask(taskId);
}

// DELETE TASK
function removeTask(taskId) {
  let index = getIndex(taskId);

  list.splice(index, 1);
  updateLocalStorage();
  updateListOnHtml();
}

// GET INDEX
function getIndex(id) {
  for (let task of list) {
    if (id === task.id) {
      return list.indexOf(task);
    }
  }
}

// MARK CHECKBOX
function markCheckbox(id) {
  let task = list[getIndex(id)];
  task.check = task.check ? false : true;
  updateLocalStorage();
  showDeleteButton();
}

// EDIT AND DELETE BUTTON IN TASK SPAN
function showEditButton(event) {
  const taskId = event.composedPath()[1].getAttribute("id");
  const editButtons = document.querySelectorAll(`#${taskId} button`);
  clearTimeout(timeoutNewSubTask[taskId]);

  editButtons.forEach((e) => {
    e.classList.add("show");
  });

  timeoutNewSubTask[taskId] = setTimeout(() => {
    editButtons.forEach((e) => {
      e.classList.remove("show");
    });

    timeoutNewSubTask = [];
  }, 2000);
}

// TURNS ANY TASKS CLICKABLE TO SHOW EDIT AND DELETE BUTTON
function updateSpanToBeClickable() {
  document.querySelectorAll(".mainTask > span").forEach((mainTask) => {
    mainTask.addEventListener("click", (event) => {
      let clickedTask = event.composedPath()[1],
        clickedTaskId = clickedTask.id;

      for (let task of list) {
        let taskElement = document.querySelector(`#t${task.id}`),
          inputElement = document.querySelector(`#t${task.id} input`);

        if (taskElement.id == clickedTaskId && !inputElement.checked) {
          showEditButton(event);
        }
      }
    });
  });
}

// SHOW THE INPUT TO ADD A NEW TASK
function showInputAddNewTask() {
  const fixedButton = document.querySelector(".fixedButton");
  const inputNewTask = document.querySelector(".addNewTask");
  const inputHasShowClass = inputNewTask.classList.contains("inputShowed");

  if (!inputHasShowClass) {
    fixedButton.classList.add("inputShowed");
    inputNewTask.classList.add("inputShowed");
    mainUlIsEmpty.classList.add("invisible");
    newTaskInput.focus();
  } else {
    fixedButton.classList.remove("inputShowed");
    inputNewTask.classList.remove("inputShowed");
    mainUlIsEmpty.classList.remove("invisible");
    newTaskInput.value = "";
  }
}

// WHEN ANY TASK CHECKED, SHOWS DELETE BUTTON ON FIXED MENU
function showDeleteButton() {
  let checkedList = listTasksChecked() || [];

  if (checkedList.length) {
    fixedDelete.classList.add("show");
  } else {
    fixedDelete.classList.remove("show");
  }
}

// DELETE ANY CHECKED TASK
function deleteCheckedTask() {
  let checkedList = listTasksChecked();

  checkedList.forEach((e) => {
    list.splice(list.indexOf(e), 1);
  });

  updateLocalStorage();
  updateListOnHtml();
  showDeleteButton();
}

// RETURN A LIST OF CHECKED TASKS
function listTasksChecked() {
  if (list.length !== 0) {
    return list.filter((e) => e.check);
  }
}

// UPDATE LOCAL STORAGE
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(list));
}
