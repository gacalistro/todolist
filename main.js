let list = [],
  timeoutNewSubTask = [];

showButtonAdd();

class Task {
  constructor(id, task, subUl = []) {
    this.id = id;
    this.task = task;
    this.subUl = subUl;
  }
}

function addNewTask() {
  let id = list.length + 1;
  let task = new Task(id, newTaskInput.value);
  list.unshift(task);

  newTaskInput.value = "";

  showButtonAdd();
  updateListOnHtml();
  updateDocument();
}

// function addNewSubTask() {}

function updateListOnHtml() {
  const ul = document.querySelector("#mainUl");

  ul.innerHTML = "";

  list.forEach((task) => {
    ul.innerHTML += `<li class="mainTask" id="t${task.id}">
      <input type="checkbox"   />
      <span>${task.task}</span>
      <ul></ul>
      <button onclick="addNewSubTask()">
        <img src="assets/add.svg" alt="" />
      </button>
    </li>`;
  });
}

function showButtonAdd(event = "") {
  const newMainTaskButton = document.querySelector(".addNewTask button");

  // BUTTON IN NEW TASK INPUT
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
  if (event.type == "click") {
    const taskId = event.path[1].getAttribute("id");
    const newSubTaskButton = document.querySelector(`#${taskId} button`);

    clearTimeout(timeoutNewSubTask[taskId]);

    newSubTaskButton.classList.add("show");

    timeoutNewSubTask[taskId] = setTimeout(() => {
      newSubTaskButton.classList.remove("show");
    }, 2000);
  }
}

function updateDocument() {
  document.querySelectorAll(".mainTask > span").forEach((mainTask) => {
    mainTask.addEventListener("click", (event) => {
      showButtonAdd(event);
    });
  });
}

// window.addEventListener("keydown", (event) => {});
