function createCell(content, className) {
  const cell = document.createElement("td");
  cell.textContent = content;
  if (className) {
    cell.classList.add(className);
  }
  return cell;
}

function createButton({ text, className, onClick }) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(...className.split(" "));
  button.addEventListener("click", onClick);
  return button;
}

function displayTodos(todos) {
  const tableBody = document.querySelector(".todo-table__body");
  tableBody.innerHTML = "";
  todos.forEach((task) => addTaskToTable(task, todos));
}

function updateTasksCount(count) {
  const footer = document.querySelector(".footer");
  footer.textContent = `Total tasks: ${count}`;
}
