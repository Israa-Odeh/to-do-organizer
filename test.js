let maxId = 0; // Variable to track the maximum ID


function getTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

function saveTodosToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createCell(content, className) {
    const cell = document.createElement('td');
    cell.textContent = content;
    if (className) {
        cell.classList.add(className);
    }
    return cell;
}

function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(...className.split(' '));
    button.addEventListener('click', onClick);
    return button;
}

function updateTasksCount(count) {
    const footer = document.querySelector('footer');
    footer.textContent = `Total tasks: ${count}`;
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
    await updateTodoInAPI(task.id, task);
}

async function handleEdit(row, task) {
    const cell = row.children[1];
    const originalText = cell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.classList.add('edit-input');

    const saveChanges = async () => {
        const updatedText = input.value.trim();
        if (updatedText.length < 5) {
            alert('Task must be at least 5 characters long.');
            input.value = originalText;
            return;
        }

        task.todo = updatedText;
        cell.textContent = updatedText;
        await updateTodoInAPI(task.id, task);
        const todos = getTodosFromLocalStorage();
        saveTodosToLocalStorage(todos.map(todo => (todo.id === task.id ? task : todo)));

        cell.removeChild(input);
        cell.classList.remove('editing');
    };

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') saveChanges();
    });

    input.addEventListener('blur', () => {
        cell.removeChild(input);
        cell.textContent = originalText;
    });

    cell.classList.add('editing');
}

function addTaskToTable(task, todos) {
    const tableBody = document.querySelector('.todo-table__body');
    const row = document.createElement('tr');
    row.classList.add('todo-table__row');

    if (task.completed) row.classList.add('completed');

    row.appendChild(createCell(task.id, 'todo-table__cell'));
    row.appendChild(createCell(task.todo, 'todo-table__cell'));
    row.appendChild(createCell(task.userId, 'todo-table__cell'));
    row.appendChild(createCell(task.completed ? 'Completed' : 'Pending', 'todo-table__cell'));

    const buttonsCell = createCell('', 'todo-table__cell');
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('todo-table__cell--buttons');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    buttonsContainer.style.alignItems = 'center';

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

async function init() {
    let todos = getTodosFromLocalStorage();

    if (todos.length === 0) {
        todos = await fetchTodosFromAPI();
        saveTodosToLocalStorage(todos);
    }

    maxId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;

    todos.forEach(task => addTaskToTable(task, todos));
    handleSearch(todos);
    updateTasksCount(todos.length);
}

document.querySelector('.task-controls__form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const todoInput = document.querySelector('.task-controls__form-input');
    const newTodoText = todoInput.value.trim();

    const taskRegex = /^.{5,}([.\?!]?)$/;

    if (!taskRegex.test(newTodoText)) {
        alert('Please enter a valid TODO task (at least 5 characters).');
        return;
    }

    let todos = getTodosFromLocalStorage();
    maxId++;

    const newTodo = {
        id: maxId,
        todo: newTodoText,
        completed: false,
        userId: Math.floor(Math.random() * 200)
    };

    if (await addTodoToAPI(newTodo)) {
        todos.push(newTodo);
        saveTodosToLocalStorage(todos);
        addTaskToTable(newTodo, todos);
        todoInput.value = '';
        updateTasksCount(todos.length);
    } else {
        alert('Failed to add the TODO to the server.');
    }
});

init();