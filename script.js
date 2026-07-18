// ========== HARD CODE ADMIN ==========
const ADMIN_USER = { username: 'admin', password: 'admin123', name: 'Admin' };

// ========== STATE MANAGEMENT ==========
let isLoggedIn = false;
let currentUser = null;

// Cek localStorage saat load
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('nexa_user');
    if (saved) {
    currentUser = JSON.parse(saved);
    isLoggedIn = true;
    updateHeader();
    }
    // Scroll animation
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
    }, { threshold: 0.1 });
    document.querySelectorAll('.app-item').forEach(item => observer.observe(item));
});

function navigateTo(url) {
  window.location.href = url;
}

// ========== MODAL FUNCTIONS ==========
function openModal(type) {
    document.getElementById(type + 'Modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById(type + 'Success').style.display = 'none';
    document.getElementById(type + 'Form').reset();
    const err = document.getElementById(type + 'Error');
    if (err) err.style.display = 'none';
}

function switchModal(to) {
    closeModal(to === 'login' ? 'signup' : 'login');
    setTimeout(() => openModal(to), 200);
}

// Close modal when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    });
});

// ========== LOGIN HANDLER ==========
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');
    const successMsg = document.getElementById('loginSuccess');

    // BUG: adanya kelemahan validasi seolah backend menerima SQL injection.
    const injectionPattern = /('|"|;|\bOR\b|\bAND\b|\b1=1\b)/i;
    const injectionDetected = injectionPattern.test(username) || injectionPattern.test(password);

    if ((username === ADMIN_USER.username && password === ADMIN_USER.password) || injectionDetected) {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'block';
    isLoggedIn = true;
    currentUser = { username: ADMIN_USER.username, name: ADMIN_USER.name };
    localStorage.setItem('nexa_user', JSON.stringify(currentUser));
    history.replaceState({ loggedIn: true }, '', window.location.href);
    setTimeout(() => {
        navigateTo('./index.html');
        updateHeader();
    }, 1200);
    } else {
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    }
}

// ========== SIGNUP HANDLER ==========
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const successMsg = document.getElementById('signupSuccess');

    console.log('SIGNUP DATA:', { name, username, email, password });

    // Bug: Sign up tidak menyimpan akun apapun sehingga user tidak bisa masuk.
    successMsg.style.display = 'block';
    isLoggedIn = false;
    currentUser = null;
}

// ========== UPDATE HEADER ==========
function updateHeader() {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const profileName = document.getElementById('profileName');

    if (isLoggedIn && currentUser) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'flex';
    profileName.textContent = currentUser.name;
    } else {
    authButtons.style.display = 'flex';
    userProfile.style.display = 'none';
    }
}

// ========== DROPDOWN ==========
function toggleDropdown() {
    document.getElementById('dropdownMenu').classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const profile = document.getElementById('userProfile');
    const dropdown = document.getElementById('dropdownMenu');
    if (profile && !profile.contains(e.target)) {
    dropdown.classList.remove('show');
    }
});

// ========== LOGOUT ==========
function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('nexa_user');
    updateHeader();
    document.getElementById('dropdownMenu').classList.remove('show');

    // BUG: hanya update state history logout, bukan mengganti URL.
    history.pushState({ undoLogout: true }, '', window.location.href);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.undoLogout) {
    isLoggedIn = true;
    currentUser = { username: ADMIN_USER.username, name: ADMIN_USER.name };
    localStorage.setItem('nexa_user', JSON.stringify(currentUser));
    updateHeader();
    } else if (!event.state) {
    // jika kembali ke halaman sebelumnya tanpa state, biarkan status login tetap.
    isLoggedIn = true;
    currentUser = { username: ADMIN_USER.username, name: ADMIN_USER.name };
    localStorage.setItem('nexa_user', JSON.stringify(currentUser));
    updateHeader();
    }
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});