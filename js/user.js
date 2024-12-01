let currentUserId = null;

function generateRandomUserId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function initializeUserId() {
  const storedUserId = localStorage.getItem("currentUserId");
  if (storedUserId) {
    currentUserId = parseInt(storedUserId, 10);
  } else {
    localStorage.setItem("currentUserId", generateRandomUserId());
  }
}

function getCurrentUserId() {
  return currentUserId;
}
