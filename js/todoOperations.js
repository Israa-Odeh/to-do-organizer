function addTaskToTable(task, todos) {
  const tableBody = document.querySelector(".todo-table__body");
  const row = document.createElement("tr");
  row.classList.add("todo-table__row");

  if (task.completed) {
    row.classList.add("completed");
  }

  row.appendChild(createCell(task.id, "todo-table__cell"));
  row.appendChild(createCell(task.todo, "todo-table__cell"));
  row.appendChild(createCell(task.userId, "todo-table__cell"));
  row.appendChild(
    createCell(task.completed ? "Completed" : "Pending", "todo-table__cell")
  );

  const buttonsCell = createCell("", "todo-table__cell");
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("todo-table__cell--buttons");

  const deleteButton = createButton({
    text: "Delete",
    className: "todo-table__button todo-table__button--delete",
    onClick: () => handleDeleteTodo(row, task.id),
  });
  const doneButton = createButton({
    text: task.completed ? "Undo" : "Done",
    className: "todo-table__button todo-table__button--done",
    onClick: () => handleDone(row, task, doneButton, todos),
  });

  buttonsContainer.append(deleteButton, doneButton);
  buttonsCell.appendChild(buttonsContainer);
  row.appendChild(buttonsCell);
  tableBody.appendChild(row);

  row.children[1].addEventListener("click", () => handleEdit(row, task));
  updateTasksCount(tableBody.children.length);
}

function initializeSearchListener() {
  const searchInput = document.querySelector(".task-controls__search-input");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredTodos = todos.filter((task) =>
      task.todo.toLowerCase().includes(query)
    );
    displayTodos(filteredTodos);
    updateTasksCount(filteredTodos.length);
  });
}

async function handleDeleteTodo(row, taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  const isDeleted = await deleteTodoFromAPI(taskId);

  if (!isDeleted) {
    alert("Failed to delete the TODO from the server.");
    return;
  }

  row.remove();

  const updatedTodos = todos.filter((todo) => todo.id !== taskId);
  saveTodosToLocalStorage(updatedTodos);

  todos = updatedTodos;

  const searchInput = document.querySelector(".task-controls__search-input");
  const query = searchInput.value.trim().toLowerCase();

  const displayedTodos = updatedTodos.filter(
    (task) => !query || task.todo.toLowerCase().includes(query)
  );

  displayTodos(displayedTodos);
  updateTasksCount(displayedTodos.length);
}

async function handleDone(row, task, doneButton, todos) {
  task.completed = !task.completed;
  const isUpdated = await updateTodoInAPI(task);
  if (!isUpdated) {
    alert("Failed to update the TODO on the server.");
    return;
  }
  row.children[3].textContent = task.completed ? "Completed" : "Pending";
  row.classList.toggle("completed", task.completed);
  doneButton.textContent = task.completed ? "Undo" : "Done";
  const updatedTodos = todos.map((todo) => (todo.id === task.id ? task : todo));
  saveTodosToLocalStorage(updatedTodos);
}

async function handleEdit(row, task) {
  const cell = row.children[1];
  const originalText = cell.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.classList.add("editing-input");

  const saveChanges = async () => {
    const updatedText = input.value.trim();
    if (updatedText.length < 5) {
      alert("Task must be at least 5 characters long.");
      input.value = originalText;
      return;
    }

    task.todo = updatedText;

    const isUpdated = await updateTodoInAPI(task);
    if (!isUpdated) {
      alert("Failed to update the TODO on the server.");
      return;
    }

    cell.textContent = updatedText;
    saveTodosToLocalStorage(
      todos.map((todo) => (todo.id === task.id ? task : todo))
    );
    cell.removeChild(input);
  };

  cell.textContent = "";
  cell.appendChild(input);
  input.focus();

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveChanges();
    }
  });

  input.addEventListener("blur", () => {
    cell.removeChild(input);
    cell.textContent = originalText;
  });
}
