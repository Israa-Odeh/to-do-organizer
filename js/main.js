let maxId = 0;

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