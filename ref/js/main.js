const STORAGE_KEY = "twtodos.tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const addTaskButton = document.querySelector("#add-task");
const taskFeedback = document.querySelector("#task-feedback");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");
const taskStatus = document.querySelector("#task-status");
const storageError = document.querySelector("#storage-error");

let tasks = [];
let appReady = true;

function showStorageError(message) {
  storageError.textContent = message;
  storageError.classList.remove("d-none");
}

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks === null) return;

    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks) || parsedTasks.some((task) => typeof task !== "string")) {
      throw new TypeError("O formato dos dados salvos é inválido.");
    }

    tasks = parsedTasks;
  } catch (error) {
    console.error("Não foi possível carregar as tarefas salvas.", error);
    appReady = false;
    taskInput.disabled = true;
    addTaskButton.disabled = true;
    showStorageError("Não foi possível acessar as tarefas salvas. Verifique o armazenamento do navegador e recarregue a página.");
  }
}

function saveTasks(nextTasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
  } catch (error) {
    console.error("Não foi possível salvar as tarefas.", error);
    showStorageError("Não foi possível salvar. Verifique o espaço e as permissões de armazenamento do navegador.");
    return false;
  }

  tasks = nextTasks;
  storageError.classList.add("d-none");
  renderTasks();
  return true;
}

function createActionButton(label, action, index, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-sm btn-outline-secondary";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.index = String(index);
  button.disabled = disabled;
  button.setAttribute("aria-label", action === "delete" ? `Excluir tarefa: ${tasks[index]}` : `${action === "up" ? "Mover para cima" : "Mover para baixo"}: ${tasks[index]}`);
  return button;
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center gap-3";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task;

    const actions = document.createElement("div");
    actions.className = "d-flex gap-2 flex-shrink-0";
    actions.append(
      createActionButton("↑", "up", index, index === 0),
      createActionButton("↓", "down", index, index === tasks.length - 1),
      createActionButton("Excluir", "delete", index)
    );

    item.append(text, actions);
    taskList.append(item);
  });

  const count = tasks.length;
  taskCount.textContent = `${count} ${count === 1 ? "tarefa" : "tarefas"}`;
  emptyState.classList.toggle("d-none", count > 0);
}

function validateTask(value) {
  const task = value.trim();
  const characters = Array.from(task);

  if (characters.length < 3) return "A tarefa precisa ter pelo menos 3 caracteres.";
  if (!/^\p{Lu}/u.test(task)) return "A tarefa deve começar com uma letra maiúscula.";
  return "";
}

function showTaskFeedback(message) {
  taskFeedback.textContent = message;
  taskFeedback.classList.toggle("d-block", Boolean(message));
  taskInput.classList.toggle("is-invalid", Boolean(message));
  taskInput.setAttribute("aria-invalid", String(Boolean(message)));
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!appReady) return;

  const task = taskInput.value.trim();
  const error = validateTask(task);
  showTaskFeedback(error);
  if (error) {
    taskInput.focus();
    return;
  }

  if (saveTasks([...tasks, task])) {
    taskInput.value = "";
    taskStatus.textContent = "Tarefa adicionada.";
    taskInput.focus();
  }
});

taskInput.addEventListener("input", () => {
  if (taskInput.classList.contains("is-invalid")) showTaskFeedback("");
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || !appReady) return;

  const index = Number(button.dataset.index);
  if (!Number.isInteger(index) || index < 0 || index >= tasks.length) return;

  const nextTasks = [...tasks];
  const action = button.dataset.action;

  if (action === "delete") {
    nextTasks.splice(index, 1);
  } else if (action === "up" && index > 0) {
    [nextTasks[index - 1], nextTasks[index]] = [nextTasks[index], nextTasks[index - 1]];
  } else if (action === "down" && index < nextTasks.length - 1) {
    [nextTasks[index + 1], nextTasks[index]] = [nextTasks[index], nextTasks[index + 1]];
  } else {
    return;
  }

  if (saveTasks(nextTasks)) {
    taskStatus.textContent = action === "delete" ? "Tarefa excluída." : "Ordem das tarefas atualizada.";
  }
});

loadTasks();
renderTasks();