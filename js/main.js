

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
        userId: getCurrentUserId() // Use the existing or new user ID
    };

    const isAdded = await addTodoToAPI(newTodo); // Optionally add to API
    if (isAdded) {
        todos.push(newTodo);
        saveTodosToLocalStorage(todos); // Save new TODO to localStorage
        addTaskToTable(newTodo, todos);
        todoInput.value = '';
        updateTasksCount(todos.length);
    } else {
        alert('Failed to add the TODO to the server.');
    }
});

async function init() {
    initializeUserId(); // Initialize or retrieve the user ID
    let todos = getTodosFromLocalStorage();

    if (todos.length === 0) {
        // If no todos in localStorage, fetch from API and save to localStorage
        todos = await fetchTodosFromAPI();
        saveTodosToLocalStorage(todos);
    }

    // Set maxId based on existing todos
    if (todos.length > 0) {
        maxId = Math.max(...todos.map(todo => todo.id));
    }

    todos.forEach(task => {
        addTaskToTable(task, todos);
    });

    // Initialize the search functionality
    handleSearch(todos);

    updateTasksCount(todos.length);
}

init();