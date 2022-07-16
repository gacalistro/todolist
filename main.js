// VARIABLES =======================================
let list = [],
  timeoutNewSubTask = [],
  idCount = 1,
  inputHasFocus;

const ul = document.querySelector("#mainUl");

class Task {
  constructor(id, task, subUl = []) {
    this.id = id;
    this.task = task;
    this.subUl = subUl;
  }
}

// WINDOW EVENTS =======================================
// any click after a new task input was on focus can cancel the input and hide it
window.addEventListener("click", (event) => {
  if (document.activeElement == newTaskInput) {
    inputHasFocus = true;
    return;
  }

  if (inputHasFocus) {
    if (!/addNewTaskButton|addNewTaskImg|fixedAdd/.test(event.target.id)) {
      fixedAdd.click();
    }
  }

  inputHasFocus = false;
});

// Add a task with enter key
window.addEventListener("keydown", (event) => {
  if (document.activeElement.getAttribute("id") == "newTaskInput") {
    if (newTaskInput.value != "" && event.key == "Enter") {
      addNewTask();
    }
  }
});

function mainUlEmpty() {
  if (list.length > 0) {
    mainUlIsEmpty.classList.add("hidden");
  } else {
    mainUlIsEmpty.classList.remove("hidden");
  }
}

// FUNCTIONS =======================================

function addNewTask() {
  let checkedList = taskChecked();

  let id = idCount++;
  let task = new Task(id, newTaskInput.value);
  list.unshift(task);

  newTaskInput.value = "";

  showButtonAdd();
  updateListOnHtml(checkedList);
  showInputAddNewTask();
  inputHasFocus = false;
}

// function addNewSubTask() {}

function updateListOnHtml(checkedList = "") {
  ul.innerHTML = "";

  list.forEach((task) => {
    let checked = false;

    for (let checkedTask of checkedList) {
      if (task.id == checkedTask.id) {
        checked = true;
      }
    }

    ul.innerHTML += `<li class="mainTask" id="t${task.id}">
      <input type="checkbox" onclick="showDeleteButton()" ${
        checked ? "checked" : ""
      } />
      <span>${task.task}</span>
      
      
      <button onclick="addNewSubTask()">
      <img src="assets/add.svg" alt="" />
      </button>
      
        
      </li>`;
  });

  mainUlEmpty();
  updateSpanToBeClickable();
}

// return a list of all the sub tasks of a task in html format
function listSubUl(task) {
  let subUlElement = "";

  task.subUl.forEach((subTask) => {
    subUlElement += `<li class="subTask" id="t${subTask.id}">
    <input type="checkbox" onclick="showDeleteButton()" />
    <span>${subTask.task}</span>
    </li>`;
  });

  return subUlElement;
}

// responsible to show the ADD button in front of the task
function showButtonAdd(event = "") {
  const newMainTaskButton = document.querySelector(".addNewTask button");

  // When writing a task, it will show an ADD button to add the task being written.
  if (event == "") {
    newTaskInput.scrollLeft += newTaskInput.scrollWidth;

    if (newTaskInput.value == "") {
      newMainTaskButton.setAttribute("disabled", true);
      newMainTaskButton.classList.remove("show");
    } else {
      newMainTaskButton.removeAttribute("disabled");
      newMainTaskButton.classList.add("show");
    }
  }

  // BUTTON IN NEW SUB TASK SPAN
  /*if (event.type == "click") {
    const taskId = event.composedPath()[1].getAttribute("id");
    const newSubTaskButton = document.querySelector(`#${taskId} button`);

    clearTimeout(timeoutNewSubTask[taskId]);

    newSubTaskButton.classList.add("show");

    timeoutNewSubTask[taskId] = setTimeout(() => {
      newSubTaskButton.classList.remove("show");
    }, 2000);
  }*/
}

// any task's span is clickable
function updateSpanToBeClickable() {
  document.querySelectorAll(".mainTask > span").forEach((mainTask) => {
    mainTask.addEventListener("click", (event) => {
      let clickedTask = event.composedPath()[1],
        clickedTaskId = clickedTask.id;

      for (let task of list) {
        if ("t" + task.id == clickedTaskId) {
          showButtonAdd(event);
        }
      }
    });
  });
}

// Show the input to add a new task
function showInputAddNewTask() {
  const fixedButton = document.querySelector(".fixedButton");
  const inputNewTask = document.querySelector(".addNewTask");
  const inputHasShowClass = inputNewTask.classList.contains("inputShowed");

  showButtonAdd();

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

// When a task is checked, it shows the delete button
function showDeleteButton() {
  let checkedList = taskChecked() || [];

  if (checkedList.length) {
    fixedDelete.classList.add("show");
  } else {
    fixedDelete.classList.remove("show");
  }
}

// Delete any checked task
function deleteCheckedTask() {
  let checkedList = taskChecked();

  checkedList.forEach((e) => {
    list.splice(list.indexOf(e), 1);
  });

  updateListOnHtml();
  showDeleteButton();
}

// Return a list of checked tasks
function taskChecked() {
  if (ul.innerHTML != "") {
    return list.filter((e) => {
      let checkbox = document.querySelector(`li#t${e.id} input`);

      if (checkbox.checked) {
        return checkbox;
      }
    });
  }
}
