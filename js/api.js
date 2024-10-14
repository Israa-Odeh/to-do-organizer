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
        const options = {
            method,
        };

        if (method !== 'DELETE') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        return response.ok;
    } catch (error) {
        console.error(`Error during ${method} request:`, error);
        return false;
    }
}

async function addTodoToAPI(todo) {
    const requestBody = {
        todo: todo.todo,
        completed: todo.completed,
        userId: todo.userId,
    };
    return await apiRequest('https://dummyjson.com/todos/add', 'POST', requestBody);
}

async function deleteTodoFromAPI(todoId) {
    return await apiRequest(`https://dummyjson.com/todos/${todoId}`, 'DELETE');
}

async function updateTodoInAPI(updatedTodo) {
    const requestBody = {
        completed: updatedTodo.completed,
    };
    return await apiRequest(`https://dummyjson.com/todos/${updatedTodo.id}`, 'PUT', requestBody);
}