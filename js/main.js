let maxId = 0;
let todos = getTodosFromLocalStorage();

document.querySelector('.task-controls__form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const todoInput = document.querySelector('.task-controls__form-input');
    const newTodoText = todoInput.value.trim();

    if (newTodoText.length < 5) {
        alert('Please enter a valid TODO task (at least 5 characters).');
        return;
    }

    maxId++;

    const newTodo = {
        id: maxId,
        todo: newTodoText,
        completed: false,
        userId: getCurrentUserId()
    };

    todos.push(newTodo);
    saveTodosToLocalStorage(todos);

    displayTodos(todos);
    updateTasksCount(todos.length);

    todoInput.value = '';
    const searchInput = document.querySelector('.task-controls__search-input');
    searchInput.value = '';

    const isAdded = await addTodoToAPI(newTodo);
    if (!isAdded) {
        console.log('Failed to add the TODO to the server. The user does not exist.');
    }
});

async function init() {
    initializeUserId();

    if (todos.length === 0) {
        todos = await fetchTodosFromAPI();
        saveTodosToLocalStorage(todos);
    }

    if (todos.length > 0) {
        maxId = Math.max(...todos.map(todo => todo.id));
        displayTodos(todos);
    }

    initializeSearchListener();
    updateTasksCount(todos.length);
}

init();