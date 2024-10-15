let currentUserId = null;

function initializeUserId() {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
        currentUserId = parseInt(storedUserId, 10);
    } else {
        currentUserId = Date.now() + Math.floor(Math.random() * 1000);
        localStorage.setItem('currentUserId', currentUserId);
    }
}

function getCurrentUserId() {
    return currentUserId;
}