// ─── CONFIG ─────────────────────────────────────
const url = "http://localhost:5000";

// ─── UTILITIES ───────────────────────────────────
function togglePw(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setLoading(btnId, textId, spinnerId, loading) {
  const btn = document.getElementById(btnId);
  const text = document.getElementById(textId);
  const spinner = document.getElementById(spinnerId);
  if (!btn) return;
  btn.disabled = loading;
  if (text) text.style.display = loading ? 'none' : 'inline';
  if (spinner) spinner.style.display = loading ? 'inline' : 'none';
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = '⚠ ' + msg; el.style.display = 'flex'; }
}
function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.auth-input').forEach(e => e.classList.remove('input-error'));
}

function showGlobalError(msg) {
  const el = document.getElementById('errorMsg');
  if (el) { el.textContent = msg; el.style.display = 'flex'; }
}

// ─── REGISTER ────────────────────────────────────
async function register() {
  clearErrors();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;

  let valid = true;
  if (name.length < 2) {
    showError('nameError', 'Name must be at least 2 characters');
    document.getElementById('name').classList.add('input-error');
    valid = false;
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showError('emailError', 'Please enter a valid email');
    document.getElementById('email').classList.add('input-error');
    valid = false;
  }
  if (password.length < 6) {
    showError('passwordError', 'Password must be at least 6 characters');
    document.getElementById('password').classList.add('input-error');
    valid = false;
  }
  if (password !== confirm) {
    showError('confirmError', 'Passwords do not match');
    document.getElementById('confirmPassword').classList.add('input-error');
    valid = false;
  }
  if (!terms) {
    showToast('Please accept the Terms of Service', 'warning');
    valid = false;
  }
  if (!valid) return;

  setLoading('registerBtn', 'registerBtnText', 'registerSpinner', true);

  try {
    const res = await fetch(url + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showGlobalError(data.message || data || 'Registration failed. Please try again.');
      showToast('Registration failed', 'error');
    } else {
      document.getElementById('successMsg').style.display = 'flex';
      showToast('Account created! Welcome to FinTrak 🎉', 'success');
      setTimeout(() => window.location = 'login.html', 1800);
    }
  } catch (err) {
    showGlobalError('Network error. Is the server running?');
    showToast('Cannot connect to server', 'error');
    // Demo mode fallback
    setTimeout(() => {
      document.getElementById('successMsg').style.display = 'flex';
      showToast('Demo: Account created!', 'success');
      setTimeout(() => window.location = 'login.html', 1500);
    }, 600);
  } finally {
    setLoading('registerBtn', 'registerBtnText', 'registerSpinner', false);
  }
}

// ─── LOGIN ────────────────────────────────────────
async function login() {
  clearErrors();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  let valid = true;
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showError('emailError', 'Please enter a valid email');
    document.getElementById('email').classList.add('input-error');
    valid = false;
  }
  if (!password) {
    showError('passwordError', 'Password is required');
    document.getElementById('password').classList.add('input-error');
    valid = false;
  }
  if (!valid) return;

  setLoading('loginBtn', 'loginBtnText', 'loginSpinner', true);
  const errDiv = document.getElementById('errorMsg');
  if (errDiv) errDiv.style.display = 'none';

  try {
    const res = await fetch(url + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showGlobalError(data.message || data || 'Invalid email or password.');
      showToast('Login failed', 'error');
    } else {
      localStorage.setItem('user', JSON.stringify(data));
      document.getElementById('successMsg').style.display = 'flex';
      showToast('Welcome back, ' + (data.name || 'User') + '! 👋', 'success');
      setTimeout(() => window.location = 'dashboard.html', 1200);
    }
  } catch (err) {
    // Demo mode - allow local demo login
    if (email === 'demo@fintrak.in' && password === 'demo1234') {
      const demoUser = { _id: 'demo123', name: 'Demo User', email: 'demo@fintrak.in' };
      localStorage.setItem('user', JSON.stringify(demoUser));
      document.getElementById('successMsg').style.display = 'flex';
      showToast('Demo mode activated 🎮', 'success');
      setTimeout(() => window.location = 'dashboard.html', 1200);
    } else {
      showGlobalError('Cannot connect to server. Try the demo account.');
      showToast('Network error', 'error');
    }
  } finally {
    setLoading('loginBtn', 'loginBtnText', 'loginSpinner', false);
  }
}

// ─── LOGOUT ───────────────────────────────────────
function logout() {
  localStorage.removeItem('user');
  window.location = 'login.html';
}
