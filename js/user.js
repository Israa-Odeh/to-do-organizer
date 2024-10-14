let currentUserId = null;

function initializeUserId() {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
        currentUserId = parseInt(storedUserId, 10); // Parse to integer
    } else {
        currentUserId = Math.floor(Math.random() * 200); // Simulate user ID generation
        localStorage.setItem('currentUserId', currentUserId); // Store user ID in localStorage
    }
}

function getCurrentUserId() {
    return currentUserId; // Simply return the current user ID
}