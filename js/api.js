async function fetchTodosFromAPI() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const todosJson = await response.json();
        const todos = todosJson.todos;

        if (!Array.isArray(todos)) {
            throw new Error('Invalid response structure');
        }

        return todos;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}

async function apiRequest(url, method, body) {
    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return response.ok;
    } catch (error) {
        console.error(`Error during ${method} request:`, error);
        return false;
    }
}

async function addTodoToAPI(todo) {
    return await apiRequest('https://dummyjson.com/todos/add', 'POST', todo);
}

async function deleteTodoFromAPI(todoId) {
    return await apiRequest(`https://dummyjson.com/todos/${todoId}`, 'DELETE');
}

async function updateTodoInAPI(todoId, updatedTodo) {
    return await apiRequest(`https://dummyjson.com/todos/${todoId}`, 'PUT', updatedTodo);
}