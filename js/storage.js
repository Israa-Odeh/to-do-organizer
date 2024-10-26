function getTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

function saveTodosToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}