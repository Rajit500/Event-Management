 // ===== DARK MODE =====
function initDarkMode() {
    const toggle = document.getElementById('darkToggle');

    if (!toggle) return;

    const saved = localStorage.getItem('darkMode');

    if (saved === 'true') {
        document.body.classList.add('dark');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        toggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// ===== ACTIVE NAV LINK =====
function setActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

// ===== UPDATE NAVBAR =====
function updateNavbar() {
    const student = localStorage.getItem('currentStudent');
    const admin = localStorage.getItem('currentAdmin');
    const navLinks = document.querySelector('.nav-links');

    if (!navLinks) return;

    // REMOVE OLD LOGIN ITEM IF EXISTS
    const oldLogin = document.getElementById('navLoginItem');
    if (oldLogin) oldLogin.remove();

    // CREATE NEW LIST ITEM
    const li = document.createElement('li');
    li.id = 'navLoginItem';

    if (student) {
        const studentData = JSON.parse(student);
        const firstName = studentData.name.split(' ')[0];
        li.innerHTML = `
            <a href="#" onclick="logoutUser()"
               style="color:var(--secondary); font-weight:600;">
               👤 ${firstName} | Logout
            </a>`;
    } else if (admin) {
        const adminData = JSON.parse(admin);
        li.innerHTML = `
            <a href="#" onclick="logoutUser()"
               style="color:var(--secondary); font-weight:600;">
               🛠️ ${adminData.name} | Logout
            </a>`;
    } else {
        li.innerHTML = `
            <a href="login.html"
               style="color:var(--primary); font-weight:600;">
               🔐 Login
            </a>`;
    }

    navLinks.appendChild(li);
}

// ===== LOGOUT =====
function logoutUser() {
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('currentAdmin');
    window.location.href = 'login.html';
}

// ===== RUN ON EVERY PAGE =====
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    setActiveNav();
    updateNavbar();
});