import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { createUserProfile, isEmailRegistered } from "./firestore.js";

const auth = getAuth();

export const registerUser = async (email, password, name) => {
    try {
        if (await isEmailRegistered(email)) {
            alert("This email is already in use. Please use a different email.");
            return;
        }

        console.log("Attempting to register user with email:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User registered:", user);
        await createUserProfile(user.uid, { email, name });
        alert("Registration successful! Please log in.");
        window.location.href = 'login.html';  // Redirect to login page after successful registration
    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);
    }
};

export const loginUser = async (email, password) => {
    try {
        console.log("Attempting to log in user with email:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful, redirecting...");
        window.location.href = 'StorePage.html';  // Redirect to store page after successful login
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: Incorrect email or password.");
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        alert("Logged out successfully.");
        window.location.href = 'login.html';  // Redirect to login page
    } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed: " + error.message);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.querySelector('#logoutBtn');

    if (loginForm) {
        console.log("Login form detected.");
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log("Login attempt with:", email);
            await loginUser(email, password);
        });
    }

    if (registerForm) {
        console.log("Register form detected.");
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log("Register attempt with:", email);
            await registerUser(email, password, name);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});
