async function fetchTodosFromAPI() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { todos } = await response.json();

        if (!Array.isArray(todos)) {
            console.error('Invalid response structure');
            return [];
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
            ...(method !== 'DELETE' ? {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            } : {})
        };

        const response = await fetch(url, options);
        return response.ok;
    } catch (error) {
        console.error(`Error during ${method} request:`, error);
        return false;
    }
}

function addTodoToAPI(todo) {
    const requestBody = {
        todo: todo.todo,
        completed: todo.completed,
        userId: todo.userId,
    };
    return apiRequest('https://dummyjson.com/todos/add', 'POST', requestBody);
}

function deleteTodoFromAPI(todoId) {
    return apiRequest(`https://dummyjson.com/todos/${todoId}`, 'DELETE');
}

function updateTodoInAPI(updatedTodo, updateField) {
    const requestBody = {};

    if (updateField === 'completed') {
        requestBody.completed = updatedTodo.completed;
    }
    else if (updateField === 'todo') {
        requestBody.todo = updatedTodo.todo;
    }

    return apiRequest(`https://dummyjson.com/todos/${updatedTodo.id}`, 'PUT', requestBody);
}