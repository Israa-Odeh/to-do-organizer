function addTaskToTable(task, todos) {
    const tableBody = document.querySelector('.todo-table__body');
    const row = document.createElement('tr');
    row.classList.add('todo-table__row');

    if (task.completed) {
        row.classList.add('completed');
    }

    row.appendChild(createCell(task.id, 'todo-table__cell'));
    row.appendChild(createCell(task.todo, 'todo-table__cell'));
    row.appendChild(createCell(task.userId, 'todo-table__cell'));
    row.appendChild(createCell(task.completed ? 'Completed' : 'Pending', 'todo-table__cell'));

    const buttonsCell = createCell('', 'todo-table__cell');
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('todo-table__cell--buttons');

    const deleteButton = createButton('Delete', 'todo-table__button todo-table__button--delete', () => handleDelete(row, tableBody, todos, task.id));
    const doneButton = createButton(task.completed ? 'Undo' : 'Done', 'todo-table__button todo-table__button--done', () => handleDone(row, task, doneButton, todos));

    buttonsContainer.append(deleteButton, doneButton);
    buttonsCell.appendChild(buttonsContainer);
    row.appendChild(buttonsCell);
    tableBody.appendChild(row);

    row.children[1].addEventListener('click', () => handleEdit(row, task));
    updateTasksCount(tableBody.children.length);
}

function handleSearch(todos) {
    const searchInput = document.querySelector('.task-controls__search-input');
    const tableBody = document.querySelector('.todo-table__body');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        tableBody.innerHTML = '';

        const filteredTodos = todos.filter(task => task.todo.toLowerCase().includes(query));
        filteredTodos.forEach(task => addTaskToTable(task, todos));
        updateTasksCount(filteredTodos.length);
    });
}

async function handleDelete(row, tableBody, todos, taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const isDeleted = await deleteTodoFromAPI(taskId);
    if (isDeleted) {
        row.remove();
        const updatedTodos = todos.filter(todo => todo.id !== taskId);
        saveTodosToLocalStorage(updatedTodos);
        updateTasksCount(tableBody.children.length);
        handleSearch(updatedTodos);
        document.querySelector('.task-controls__search-input').dispatchEvent(new Event('input'));
    } else {
        alert('Failed to delete the TODO from the server.');
    }
}

async function handleDone(row, task, doneButton, todos) {
    task.completed = !task.completed;
    row.children[3].textContent = task.completed ? 'Completed' : 'Pending';
    row.classList.toggle('completed', task.completed);
    doneButton.textContent = task.completed ? 'Undo' : 'Done';

    doneButton.style.backgroundColor = task.completed ? '#f2f2f2' : '';
    doneButton.style.color = task.completed ? '#000000' : '';

    const updatedTodos = todos.map(todo => (todo.id === task.id ? task : todo));
    saveTodosToLocalStorage(updatedTodos);

    const isUpdated = await updateTodoInAPI(task);
    if (!isUpdated) {
        alert('Failed to update the TODO on the server.');
    }
}

async function handleEdit(row, task) {
    const cell = row.children[1];
    const originalText = cell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.classList.add('editing-input');

    const saveChanges = async () => {
        const updatedText = input.value.trim();
        if (updatedText.length < 5) {
            alert('Task must be at least 5 characters long.');
            input.value = originalText;
            return;
        }

        task.todo = updatedText;
        cell.textContent = updatedText;

        const isUpdated = await updateTodoInAPI(task);
        if (!isUpdated) {
            alert('Failed to update the TODO on the server.');
            cell.textContent = originalText;
            return;
        }

        const todos = getTodosFromLocalStorage();
        saveTodosToLocalStorage(todos.map(todo => (todo.id === task.id ? task : todo)));

        cell.removeChild(input);
    };

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            saveChanges();
        }
    });

    input.addEventListener('blur', () => {
        cell.removeChild(input);
        cell.textContent = originalText;
    });
}