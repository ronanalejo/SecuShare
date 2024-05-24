document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    // Redirect to login page if not logged in
    const protectedPages = ['StorePage.html', 'profile.html', 'productPage.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage) && !localStorage.getItem('user')) {
        window.location.href = 'login.html';
    }

    //Authentication
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            localStorage.setItem('user', JSON.stringify({ email }));
            window.location.href = 'StorePage.html';
        });
    }

    //Registration
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            localStorage.setItem('user', JSON.stringify({ name, email }));
            window.location.href = 'StorePage.html';
        });
    }

    if (profileName && profileEmail) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            profileName.textContent = user.name || 'User';
            profileEmail.textContent = user.email;
        } else {
            window.location.href = 'login.html';
        }
    }

    //Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});
