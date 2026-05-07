// auth.js

function registerUser(username, password) {
    let users = JSON.parse(localStorage.getItem('appUsers') || '{}');
    if (users[username]) {
        return { success: false, message: 'Username already exists. Please choose another.' };
    }
    // In a real application, passwords should be hashed on the server.
    // For this client-side demo, we store them in localStorage.
    users[username] = password; 
    localStorage.setItem('appUsers', JSON.stringify(users));
    return { success: true };
}

function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem('appUsers') || '{}');
    if (users[username] && users[username] === password) {
        sessionStorage.setItem('loggedInUser', username);
        return { success: true };
    }
    return { success: false, message: 'Invalid username or password.' };
}

function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

function requireAuth() {
    if (!sessionStorage.getItem('loggedInUser')) {
        window.location.href = 'login.html';
    }
}

function redirectIfLoggedIn() {
    if (sessionStorage.getItem('loggedInUser')) {
        window.location.href = 'index.html';
    }
}
