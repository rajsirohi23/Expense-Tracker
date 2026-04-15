// ─── FINTRAK DASHBOARD JS ────────────────────────
const url = "https://expense-tracker-1-xdp5.onrender.com";

// ─── STATE ────────────────────────────────────────
let allTransactions = [];
let filteredTransactions = [];
let allGroups = [];
let currentFilter = 'all';
let currentSection = 'dashboard';
let editingTxId = null;
let selectedCategory = '';
let selectedType = 'expense';
let isDemoMode = false;

// Date range state
let activeDateFrom = null;
let activeDateTo = null;
let activeCategory = '';
let activeQuickBtn = null;

// ─── AUTH CHECK ───────────────────────────────────
const user = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();
if (!user) { window.location = 'login.html'; }

// ─── DEMO DATA ────────────────────────────────────
const DEMO_TRANSACTIONS = [
  { _id: 'd1', title: 'Monthly Salary', amount: 65000, category: 'Salary', type: 'income', date: new Date(Date.now()-25*864e5).toISOString() },
  { _id: 'd2', title: 'Freelance Project', amount: 18000, category: 'Investment', type: 'income', date: new Date(Date.now()-18*864e5).toISOString() },
  { _id: 'd3', title: 'Zomato Order', amount: 850, category: 'Food', type: 'expense', date: new Date(Date.now()-2*864e5).toISOString() },
  { _id: 'd4', title: 'Uber Cab', amount: 450, category: 'Transport', type: 'expense', date: new Date(Date.now()-3*864e5).toISOString() },
  { _id: 'd5', title: 'Amazon Shopping', amount: 3200, category: 'Shopping', type: 'expense', date: new Date(Date.now()-5*864e5).toISOString() },
  { _id: 'd6', title: 'Netflix Subscription', amount: 499, category: 'Entertainment', type: 'expense', date: new Date(Date.now()-7*864e5).toISOString() },
  { _id: 'd7', title: 'Gym Membership', amount: 1500, category: 'Health', type: 'expense', date: new Date(Date.now()-9*864e5).toISOString() },
  { _id: 'd8', title: 'Electricity Bill', amount: 1800, category: 'Bills', type: 'expense', date: new Date(Date.now()-10*864e5).toISOString() },
  { _id: 'd9', title: 'Udemy Course', amount: 1299, category: 'Education', type: 'expense', date: new Date(Date.now()-12*864e5).toISOString() },
  { _id: 'd10', title: 'Goa Trip', amount: 8500, category: 'Travel', type: 'expense', date: new Date(Date.now()-14*864e5).toISOString() },
  { _id: 'd11', title: 'Swiggy Breakfast', amount: 320, category: 'Food', type: 'expense', date: new Date(Date.now()-1*864e5).toISOString() },
  { _id: 'd12', title: 'Bonus Received', amount: 12000, category: 'Salary', type: 'income', date: new Date(Date.now()-6*864e5).toISOString() },
  // Previous month data for charts
  { _id: 'd13', title: 'Prev Month Salary', amount: 65000, category: 'Salary', type: 'income', date: new Date(Date.now()-55*864e5).toISOString() },
  { _id: 'd14', title: 'Prev Month Rent', amount: 15000, category: 'Bills', type: 'expense', date: new Date(Date.now()-52*864e5).toISOString() },
  { _id: 'd15', title: 'Prev Month Food', amount: 4200, category: 'Food', type: 'expense', date: new Date(Date.now()-50*864e5).toISOString() },
  { _id: 'd16', title: '2 Months Ago Salary', amount: 65000, category: 'Salary', type: 'income', date: new Date(Date.now()-85*864e5).toISOString() },
  { _id: 'd17', title: '2 Months Shopping', amount: 6200, category: 'Shopping', type: 'expense', date: new Date(Date.now()-83*864e5).toISOString() },
];

const DEMO_GROUPS = [
  {
    _id: 'g1', name: 'Goa Trip 🌴', emoji: '🏖', total: 24000,
    members: ['Rahul', 'Priya', 'Amit', 'Neha'],
    balances: [
      { from: 'Priya', to: 'Rahul', amount: 2000 },
      { from: 'Amit', to: 'Rahul', amount: 1500 },
    ]
  },
  {
    _id: 'g2', name: 'Office Lunch 🍱', emoji: '🍱', total: 4800,
    members: ['Rahul', 'Vikram', 'Sunita'],
    balances: [
      { from: 'Rahul', to: 'Vikram', amount: 800 },
    ]
  },
];

// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set today's date
  const dateEl = document.getElementById('todayDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  initUser();
  initSidebar();
  initThemeToggle();
  initSearch();
  initNotifications();
  initMobileMenu();

  // Settings pre-fill
  const sn = document.getElementById('settingsName');
  const se = document.getElementById('settingsEmail');
  if (sn) sn.value = user.name || '';
  if (se) se.value = user.email || '';

  navigateTo('dashboard');
  loadData();
});

function initUser() {
  document.querySelectorAll('#username, #usernameDisplay').forEach(el => {
    el.textContent = user.name || 'User';
  });
  document.querySelectorAll('.avatar-initials').forEach(el => {
    el.textContent = (user.name || 'U').charAt(0).toUpperCase();
  });
  // Credit card
  const cardNameEl = document.getElementById('cardName');
  if (cardNameEl) cardNameEl.textContent = (user.name || 'Card Holder').toUpperCase();
}

// ─── SIDEBAR ──────────────────────────────────────
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    });
  }
}

function navigateTo(section) {
  currentSection = section;
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const sec = document.getElementById('section-' + section);
  if (sec) sec.classList.add('active');
  const nav = document.querySelector(`[data-nav="${section}"]`);
  if (nav) nav.classList.add('active');

  // Close mobile sidebar
  document.getElementById('sidebar')?.classList.remove('mobile-open');
  document.getElementById('mobileOverlay')?.classList.remove('open');

  // Update topbar title
  const titles = {
    dashboard: 'Dashboard', transactions: 'Transactions',
    groups: 'Group Expenses', analytics: 'Analytics', insights: 'Smart Insights', settings: 'Settings'
  };
  const topTitle = document.getElementById('topbarTitle');
  if (topTitle) topTitle.textContent = titles[section] || 'FinTrak';

  // Update tx badge
  const badge = document.getElementById('txBadge');
  if (badge) badge.textContent = allTransactions.length;

  if (section === 'analytics') setTimeout(() => refreshCharts(allTransactions), 100);
  if (section === 'groups') renderGroups();
  if (section === 'insights') { renderInsights(); renderMonthlySummary(); }
}

// ─── MONTHLY SUMMARY TABLE ────────────────────────
function renderMonthlySummary() {
  const tbody = document.getElementById('monthlySummaryBody');
  if (!tbody) return;
  const monthly = buildMonthlyData(allTransactions);
  tbody.innerHTML = monthly.map(m => `
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:11px 12px;font-size:13.5px;font-weight:600;">${m.month}</td>
      <td style="padding:11px 12px;text-align:right;font-size:13.5px;color:var(--accent-green);">+₹${m.income.toLocaleString('en-IN')}</td>
      <td style="padding:11px 12px;text-align:right;font-size:13.5px;color:var(--accent-red);">-₹${m.expense.toLocaleString('en-IN')}</td>
      <td style="padding:11px 12px;text-align:right;font-size:13.5px;font-weight:700;color:${m.income>=m.expense?'var(--accent-green)':'var(--accent-red)'};">
        ${m.income >= m.expense ? '+' : '-'}₹${Math.abs(m.income - m.expense).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');
}

// ─── SPLIT CALCULATOR ─────────────────────────────
function calculateSplit() {
  const amount = parseFloat(document.getElementById('splitAmount')?.value) || 0;
  const people = parseInt(document.getElementById('splitPeople')?.value) || 1;
  const tip = parseFloat(document.getElementById('splitTip')?.value) || 0;
  const total = amount * (1 + tip / 100);
  const perPerson = people > 0 ? total / people : 0;
  const resultEl = document.getElementById('splitResult');
  const totalEl = document.getElementById('splitTotal');
  if (resultEl) resultEl.textContent = '₹' + perPerson.toLocaleString('en-IN', {minimumFractionDigits:2,maximumFractionDigits:2});
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN', {minimumFractionDigits:2,maximumFractionDigits:2});
}

// ─── SAVE PROFILE ─────────────────────────────────
function saveProfile() {
  const name = document.getElementById('settingsName').value.trim();
  if (!name) { showToast('Enter a name', 'error'); return; }
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  u.name = name;
  localStorage.setItem('user', JSON.stringify(u));
  document.querySelectorAll('#username, #usernameDisplay').forEach(el => el.textContent = name);
  document.querySelectorAll('.avatar-initials').forEach(el => el.textContent = name.charAt(0).toUpperCase());
  const cardNameEl = document.getElementById('cardName');
  if (cardNameEl) cardNameEl.textContent = name.toUpperCase();
  showToast('Profile updated ✅', 'success');
}

// ─── THEME ────────────────────────────────────────
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  const isLight = localStorage.getItem('theme') === 'light';
  if (isLight) {
    document.documentElement.setAttribute('data-theme', 'light');
    toggle.classList.add('light-mode');
  }
  toggle.addEventListener('click', () => {
    const light = document.documentElement.getAttribute('data-theme') !== 'light';
    document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
    localStorage.setItem('theme', light ? 'light' : 'dark');
    toggle.classList.toggle('light-mode', light);
    // Refresh charts with new colors
    if (allTransactions.length) refreshCharts(allTransactions);
  });
}

// ─── NOTIFICATIONS ────────────────────────────────
function initNotifications() {
  const btn = document.getElementById('notifBtn');
  const dropdown = document.getElementById('notifDropdown');
  if (!btn || !dropdown) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));
}

// ─── SEARCH ───────────────────────────────────────
function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove('open'); return; }
    const matches = allTransactions.filter(t =>
      t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!matches.length) { results.classList.remove('open'); return; }
    results.innerHTML = matches.map(t => `
      <div class="search-result-item" onclick="highlightTransaction('${t._id}')">
        <span class="sr-icon">${getCatEmoji(t.category)}</span>
        <div>
          <div style="font-weight:600;">${t.title}</div>
          <div style="font-size:11px;color:var(--text-muted);">${t.category} · ₹${t.amount.toLocaleString('en-IN')}</div>
        </div>
        <span style="margin-left:auto;color:${t.type==='income'?'var(--accent-green)':'var(--accent-red)'};">
          ${t.type==='income'?'+':'-'}₹${t.amount.toLocaleString('en-IN')}
        </span>
      </div>
    `).join('');
    results.classList.add('open');
  });
  document.addEventListener('click', e => {
    if (!input.contains(e.target)) results.classList.remove('open');
  });
}

function highlightTransaction(id) {
  navigateTo('transactions');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').classList.remove('open');
  setTimeout(() => {
    const el = document.querySelector(`[data-tx-id="${id}"]`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.background = 'rgba(139,92,246,0.2)'; setTimeout(() => el.style.background = '', 1500); }
  }, 300);
}

// ─── MOBILE MENU ──────────────────────────────────
function initMobileMenu() {
  const fab = document.getElementById('mobileFab');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  if (fab) fab.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('open');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('open');
  });
}

// ─── LOAD DATA ────────────────────────────────────
async function loadData() {
  showLoadingSkeleton();
  try {
    const [txRes, grpRes] = await Promise.all([
      fetch(url + '/transaction/' + user._id),
      fetch(url + '/group/' + user._id)
    ]);
    if (!txRes.ok) throw new Error('Server error');
    allTransactions = await txRes.json();
    allGroups = grpRes.ok ? await grpRes.json() : [];
    isDemoMode = false;
  } catch {
    allTransactions = DEMO_TRANSACTIONS;
    allGroups = DEMO_GROUPS;
    isDemoMode = true;
    showToast('Demo mode — showing sample data 🎮', 'info');
  }
  filteredTransactions = [...allTransactions];
  renderDashboard();
  renderTransactions();
  refreshCharts(allTransactions);
  renderInsights();
}

function showLoadingSkeleton() {
  const list = document.getElementById('transactionList');
  if (list) list.innerHTML = Array(5).fill('<div class="skeleton skeleton-row"></div>').join('');
}

// ─── DASHBOARD ────────────────────────────────────
function renderDashboard() {
  let income = 0, expense = 0;
  allTransactions.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });
  const balance = income - expense;
  const savings = Math.max(0, balance);
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';

  animateCounter('totalBalance', balance);
  animateCounter('totalIncome', income);
  animateCounter('totalExpense', expense);
  animateCounter('totalSavings', savings);

  const srEl = document.getElementById('savingsRate');
  if (srEl) srEl.textContent = savingsRate + '%';

  // Recent transactions (last 5)
  const recent = [...allTransactions].sort((a,b) => new Date(b.date||b.createdAt||0) - new Date(a.date||a.createdAt||0)).slice(0,5);
  renderTransactionItems(recent, 'recentList');

  // Spending progress bars
  const catMap = {};
  allTransactions.filter(t=>t.type==='expense').forEach(t => {
    catMap[t.category] = (catMap[t.category]||0) + t.amount;
  });
  const topCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const topSpending = document.getElementById('topSpending');
  if (topSpending) {
    topSpending.innerHTML = topCats.map(([cat, amt]) => `
      <div style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:13px;font-weight:600;display:flex;align-items:center;gap:7px;">
            <span>${getCatEmoji(cat)}</span>${cat}
          </span>
          <span style="font-size:13px;font-weight:700;">₹${amt.toLocaleString('en-IN')}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:0%;background:${getCatColor(cat)};" data-target="${expense>0?(amt/expense*100).toFixed(0):0}"></div>
        </div>
      </div>
    `).join('') || '<p style="font-size:13px;color:var(--text-muted);">No expense data yet.</p>';
    // Animate progress bars
    setTimeout(() => {
      topSpending.querySelectorAll('.progress-fill').forEach(b => {
        b.style.width = b.dataset.target + '%';
      });
    }, 200);
  }

  // Quick charts for dashboard
  drawDonutChart(allTransactions);
  drawSavingsChart(buildMonthlyData(allTransactions));
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const duration = 900;
  const startTime = performance.now();
  const format = v => '₹' + Math.round(v).toLocaleString('en-IN');
  function update(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = format(start + (target - start) * ease);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ─── TRANSACTIONS ─────────────────────────────────
function renderTransactions() {
  renderTransactionItems(filteredTransactions, 'transactionList');
}

function renderTransactionItems(txList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!txList.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💸</div>
        <div class="empty-title">No transactions found</div>
        <div class="empty-sub">Add your first transaction to get started</div>
      </div>
    `;
    return;
  }

  container.innerHTML = txList.map(t => {
    const date = new Date(t.date || t.createdAt || Date.now());
    const dateStr = date.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    const catColor = getCatColor(t.category);
    const catEmoji = getCatEmoji(t.category);
    return `
      <div class="tx-item" data-tx-id="${t._id}">
        <div class="tx-icon" style="background:${catColor}22;">
          <span>${catEmoji}</span>
        </div>
        <div class="tx-info">
          <div class="tx-title">${t.title}</div>
          <div class="tx-meta">
            <span class="tx-cat-badge" style="background:${catColor}22;color:${catColor};">${t.category}</span>
            <span>${dateStr}</span>
          </div>
        </div>
        <div class="tx-right">
          <div class="tx-amount ${t.type}">${t.type==='income'?'+':'-'}₹${Number(t.amount).toLocaleString('en-IN')}</div>
          <div class="tx-date">${t.type === 'income' ? 'Income' : 'Expense'}</div>
        </div>
        <div class="tx-actions">
          <button class="tx-action-btn edit" onclick="openEditModal('${t._id}')" title="Edit">✏️</button>
          <button class="tx-action-btn" onclick="deleteTransaction('${t._id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }).join('');

  // Ripple effect
  container.querySelectorAll('.tx-item').forEach(item => addRipple(item));
}

function filterTransactions(type) {
  currentFilter = type;
  document.querySelectorAll('.filter-bar .filter-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().toLowerCase() === type || (type === 'all' && b.textContent.trim() === 'All'));
  });
  applyAllFilters();
}

function filterByCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  applyAllFilters();
}

// ─── DATE RANGE FILTER ────────────────────────────
function applyDateFilter() {
  const from = document.getElementById('dateFrom').value;
  const to   = document.getElementById('dateTo').value;

  activeDateFrom = from ? new Date(from + 'T00:00:00') : null;
  activeDateTo   = to   ? new Date(to   + 'T23:59:59') : null;

  // Clear active quick-btn highlight
  document.querySelectorAll('.date-quick-btn').forEach(b => b.classList.remove('active'));
  activeQuickBtn = null;

  applyAllFilters();
}

function setQuickRange(range) {
  const now   = new Date();
  let from, to;

  switch (range) {
    case 'today':
      from = toDateStr(now);
      to   = toDateStr(now);
      break;
    case 'week': {
      const day  = now.getDay();                              // 0=Sun
      const mon  = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
      from = toDateStr(mon);
      to   = toDateStr(now);
      break;
    }
    case 'month':
      from = toDateStr(new Date(now.getFullYear(), now.getMonth(), 1));
      to   = toDateStr(now);
      break;
    case 'last30': {
      const d = new Date(now); d.setDate(now.getDate() - 29);
      from = toDateStr(d);
      to   = toDateStr(now);
      break;
    }
    case 'last90': {
      const d = new Date(now); d.setDate(now.getDate() - 89);
      from = toDateStr(d);
      to   = toDateStr(now);
      break;
    }
    case 'year':
      from = toDateStr(new Date(now.getFullYear(), 0, 1));
      to   = toDateStr(now);
      break;
    default:
      from = '';
      to   = '';
  }

  document.getElementById('dateFrom').value = from;
  document.getElementById('dateTo').value   = to;
  activeDateFrom = from ? new Date(from + 'T00:00:00') : null;
  activeDateTo   = to   ? new Date(to   + 'T23:59:59') : null;

  // Highlight active quick btn
  document.querySelectorAll('.date-quick-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  activeQuickBtn = range;

  applyAllFilters();
}

function clearDateFilter() {
  activeDateFrom = null;
  activeDateTo   = null;
  activeQuickBtn = null;
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value   = '';
  document.querySelectorAll('.date-quick-btn').forEach(b => b.classList.remove('active'));
  applyAllFilters();
}

// ─── MASTER FILTER — combines date + type + category ─
function applyAllFilters() {
  let result = [...allTransactions];

  // 1. Date range
  if (activeDateFrom || activeDateTo) {
    result = result.filter(t => {
      const d = new Date(t.date || t.createdAt || 0);
      if (activeDateFrom && d < activeDateFrom) return false;
      if (activeDateTo   && d > activeDateTo)   return false;
      return true;
    });
  }

  // 2. Type (income / expense / all)
  if (currentFilter !== 'all') {
    result = result.filter(t => t.type === currentFilter);
  }

  // 3. Category
  if (activeCategory) {
    result = result.filter(t => t.category === activeCategory);
  }

  filteredTransactions = result;

  // Update UI
  updateDateRangeUI(result);
  updatePanelTitle(result);
  renderTransactions();
}

function updateDateRangeUI(result) {
  const isActive = activeDateFrom || activeDateTo;
  const card     = document.getElementById('dateRangeCard');
  const badge    = document.getElementById('dateRangeBadge');
  const summary  = document.getElementById('dateRangeSummary');
  const metaEl   = document.getElementById('txSectionMeta');

  if (card)    card.classList.toggle('active', !!isActive);
  if (badge)   badge.style.display = isActive ? 'flex' : 'none';
  if (summary) summary.style.display = isActive ? 'grid' : 'none';

  if (!isActive) {
    if (metaEl) metaEl.textContent = 'All your income & expense records';
    return;
  }

  // Compute summary stats
  let income = 0, expense = 0;
  result.forEach(t => {
    if (t.type === 'income')  income  += t.amount;
    else                       expense += t.amount;
  });
  const net = income - expense;

  const fmt = v => '₹' + Math.abs(v).toLocaleString('en-IN');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('drsIncome',  fmt(income));
  set('drsExpense', fmt(expense));
  set('drsBalance', (net >= 0 ? '+' : '-') + fmt(net));
  set('drsCount',   result.length);

  // Colour net balance
  const balEl = document.getElementById('drsBalance');
  if (balEl) balEl.style.color = net >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

  // Update section meta
  if (metaEl) {
    const fromStr = activeDateFrom ? activeDateFrom.toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) : '—';
    const toStr   = activeDateTo   ? activeDateTo.toLocaleDateString('en-IN',   {day:'numeric',month:'short',year:'numeric'}) : '—';
    metaEl.textContent = `Showing ${result.length} transaction${result.length !== 1 ? 's' : ''} from ${fromStr} to ${toStr}`;
  }
}

function updatePanelTitle(result) {
  const titleEl = document.getElementById('panelTitle');
  if (!titleEl) return;
  const isFiltered = activeDateFrom || activeDateTo || activeCategory || currentFilter !== 'all';
  titleEl.textContent = isFiltered
    ? `${result.length} Transaction${result.length !== 1 ? 's' : ''} Found`
    : 'All Transactions';
}

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

// ─── ADD / EDIT TRANSACTION ───────────────────────
function openAddModal() {
  editingTxId = null;
  selectedCategory = '';
  selectedType = 'expense';
  document.getElementById('modalTitle').textContent = 'Add Transaction';
  document.getElementById('txTitle').value = '';
  document.getElementById('txAmount').value = '';
  document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
  setTypeToggle('expense');
  document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
  openModal('txModal');
}

function openEditModal(id) {
  const tx = allTransactions.find(t => t._id === id);
  if (!tx) return;
  editingTxId = id;
  selectedCategory = tx.category;
  selectedType = tx.type;
  document.getElementById('modalTitle').textContent = 'Edit Transaction';
  document.getElementById('txTitle').value = tx.title;
  document.getElementById('txAmount').value = tx.amount;
  document.getElementById('txDate').value = (tx.date||tx.createdAt||new Date().toISOString()).split('T')[0];
  setTypeToggle(tx.type);
  document.querySelectorAll('.cat-option').forEach(o => {
    o.classList.toggle('selected', o.dataset.cat === tx.category);
  });
  openModal('txModal');
}

function setTypeToggle(type) {
  selectedType = type;
  document.querySelectorAll('.type-option').forEach(o => {
    o.className = 'type-option';
    if (o.dataset.type === type) o.classList.add('active-' + type);
  });
}

function selectCategory(el, cat) {
  selectedCategory = cat;
  document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

async function saveTransaction() {
  const title = document.getElementById('txTitle').value.trim();
  const amount = Number(document.getElementById('txAmount').value);
  const date = document.getElementById('txDate').value;

  if (!title) { showToast('Please enter a title', 'error'); return; }
  if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
  if (!selectedCategory) { showToast('Please select a category', 'error'); return; }

  const payload = { userId: user._id, title, amount, category: selectedCategory, type: selectedType, date };

  try {
    let res;
    if (editingTxId) {
      res = await fetch(url + '/transaction/' + editingTxId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(url + '/transaction/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    if (!res.ok) throw new Error('Server error');
    closeModal('txModal');
    showToast(editingTxId ? 'Transaction updated ✅' : 'Transaction added ✅', 'success');
    loadData();
  } catch {
    // Demo mode
    if (editingTxId) {
      const idx = allTransactions.findIndex(t => t._id === editingTxId);
      if (idx !== -1) allTransactions[idx] = { ...allTransactions[idx], ...payload };
    } else {
      allTransactions.unshift({ _id: 'd_' + Date.now(), ...payload });
    }
    filteredTransactions = [...allTransactions];
    closeModal('txModal');
    showToast(editingTxId ? 'Transaction updated ✅' : 'Transaction added ✅', 'success');
    renderDashboard();
    renderTransactions();
    refreshCharts(allTransactions);
    renderInsights();
  }
}

async function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;
  try {
    await fetch(url + '/transaction/' + id, { method: 'DELETE' });
  } catch {}
  allTransactions = allTransactions.filter(t => t._id !== id);
  filteredTransactions = filteredTransactions.filter(t => t._id !== id);
  renderDashboard();
  renderTransactions();
  refreshCharts(allTransactions);
  renderInsights();
  showToast('Transaction deleted', 'info');
}

// ─── GROUPS ───────────────────────────────────────
let currentGroupId = null;
let selectedGroupEmoji = '🏖';
let groupMembers = []; // tags in create modal

function renderGroups() {
  const grid = document.getElementById('groupsGrid');
  if (!grid) return;

  const groups = isDemoMode ? DEMO_GROUPS : allGroups;

  // Update summary bar
  let totalOwe = 0, totalOwed = 0;
  groups.forEach(g => {
    (g.balances || []).forEach(b => {
      const myName = user.name;
      if (b.from === myName) totalOwe += b.amount;
      if (b.to === myName) totalOwed += b.amount;
    });
  });
  const gsbGroups = document.getElementById('gsbGroups');
  const gsbOwe = document.getElementById('gsbOwe');
  const gsbOwed = document.getElementById('gsbOwed');
  if (gsbGroups) gsbGroups.textContent = groups.length;
  if (gsbOwe) gsbOwe.textContent = '₹' + totalOwe.toLocaleString('en-IN');
  if (gsbOwed) gsbOwed.textContent = '₹' + totalOwed.toLocaleString('en-IN');

  if (!groups.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;padding:60px 24px;">
        <div class="empty-icon">👥</div>
        <div class="empty-title">No groups yet</div>
        <div class="empty-sub" style="margin-bottom:20px;">Create a group to split expenses with friends, family or colleagues</div>
        <button type="button" class="btn btn-primary" onclick="openCreateGroup()">+ Create your first group</button>
      </div>`;
    return;
  }

  const MEMBER_COLORS = ['#8b5cf6','#3b82f6','#10b981','#f97316','#ec4899','#06b6d4','#eab308'];

  grid.innerHTML = groups.map(g => {
    const memberAvatars = (g.members || []).slice(0,5).map((m, i) =>
      `<div class="member-avatar-sm" style="background:${MEMBER_COLORS[i % MEMBER_COLORS.length]};" title="${m}">${m.charAt(0).toUpperCase()}</div>`
    ).join('');
    const extra = (g.members||[]).length > 5 ? `<div class="member-avatar-sm member-more">+${g.members.length-5}</div>` : '';

    const balances = g.balances || [];
    const balanceHTML = balances.length
      ? balances.slice(0,3).map(b => `
          <div class="balance-row">
            <span style="font-size:13px;">${b.from} → ${b.to}</span>
            <span class="owe-badge">₹${Number(b.amount).toLocaleString('en-IN')}</span>
          </div>`).join('') + (balances.length > 3 ? `<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:6px;">+${balances.length-3} more settlements</div>` : '')
      : `<div class="balance-settled">✅ All settled up!</div>`;

    const expenseCount = (g.expenses || []).length;
    const perPerson = (g.members||[]).length > 0 ? ((g.total||0) / (g.members||[1]).length) : 0;

    return `
      <div class="group-card" onclick="openGroupDetail('${g._id}')">
        <div class="group-card-banner" style="background:linear-gradient(90deg,${MEMBER_COLORS[0]},${MEMBER_COLORS[1]},${MEMBER_COLORS[2]});"></div>
        <div class="group-card-body">
          <div class="group-header">
            <div class="group-avatar">${g.emoji || '👥'}</div>
            <div style="flex:1;min-width:0;">
              <div class="group-name">${g.name}</div>
              <div class="group-members-count">${(g.members||[]).length} members · ${expenseCount} expenses</div>
            </div>
            <div class="group-actions" onclick="event.stopPropagation()">
              <button type="button" class="btn btn-primary btn-sm" onclick="openAddGroupExpense('${g._id}')">+ Expense</button>
            </div>
          </div>

          <div class="group-stats">
            <div class="gstat">
              <div class="gstat-val" style="color:var(--accent-purple);">₹${(g.total||0).toLocaleString('en-IN')}</div>
              <div class="gstat-label">Total Spent</div>
            </div>
            <div class="gstat">
              <div class="gstat-val" style="color:var(--accent-blue);">${expenseCount}</div>
              <div class="gstat-label">Expenses</div>
            </div>
            <div class="gstat">
              <div class="gstat-val" style="color:var(--accent-cyan);">₹${Math.round(perPerson).toLocaleString('en-IN')}</div>
              <div class="gstat-label">Per Person</div>
            </div>
          </div>

          <div class="group-members-row">
            <div class="member-avatars">${memberAvatars}${extra}</div>
            <span style="font-size:12px;color:var(--text-muted);">Click to view details →</span>
          </div>

          <div class="group-balance-section">
            <div class="gbal-label">Balances</div>
            ${balanceHTML}
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── CREATE GROUP ──────────────────────────────────
function openCreateGroup() {
  groupMembers = [];
  selectedGroupEmoji = '🏖';
  document.getElementById('groupName').value = '';
  document.getElementById('groupSelfName').value = user.name || '';
  document.getElementById('memberInput').value = '';
  // Reset tags
  const wrap = document.getElementById('memberTagsWrap');
  wrap.querySelectorAll('.member-tag').forEach(t => t.remove());
  // Reset emoji
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  document.querySelector('.emoji-opt')?.classList.add('selected');
  openModal('groupModal');
  setTimeout(() => document.getElementById('groupName').focus(), 150);
}

function selectEmoji(el, emoji) {
  selectedGroupEmoji = emoji;
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function handleMemberInput(e) {
  const input = document.getElementById('memberInput');
  const val = input.value.trim().replace(/,$/, '');
  if ((e.key === 'Enter' || e.key === ',') && val) {
    e.preventDefault();
    if (!groupMembers.includes(val)) {
      groupMembers.push(val);
      addMemberTag(val);
    }
    input.value = '';
  } else if (e.key === 'Backspace' && !input.value && groupMembers.length) {
    const removed = groupMembers.pop();
    document.querySelector(`.member-tag[data-name="${removed}"]`)?.remove();
  }
}

function addMemberTag(name) {
  const wrap = document.getElementById('memberTagsWrap');
  const tag = document.createElement('div');
  tag.className = 'member-tag';
  tag.dataset.name = name;
  tag.innerHTML = `${name} <span class="member-tag-remove" onclick="removeMemberTag('${name}')">×</span>`;
  wrap.insertBefore(tag, document.getElementById('memberInput'));
}

function removeMemberTag(name) {
  groupMembers = groupMembers.filter(m => m !== name);
  document.querySelector(`.member-tag[data-name="${name}"]`)?.remove();
}

async function saveGroup() {
  const name = document.getElementById('groupName').value.trim();
  const selfName = document.getElementById('groupSelfName').value.trim();
  // Also check if there's text in the input that wasn't added yet
  const inputVal = document.getElementById('memberInput').value.trim();
  if (inputVal && !groupMembers.includes(inputVal)) groupMembers.push(inputVal);

  if (!name) { showToast('Enter a group name', 'error'); return; }
  if (!selfName) { showToast('Enter your name for this group', 'error'); return; }
  if (groupMembers.length < 1) { showToast('Add at least 1 other member', 'error'); return; }

  const allMembers = [selfName, ...groupMembers.filter(m => m !== selfName)];

  try {
    const res = await fetch(url + '/group/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, members: allMembers, userId: user._id, emoji: selectedGroupEmoji })
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    allGroups.push({ ...data, balances: [] });
    isDemoMode = false;
  } catch {
    const newGroup = { _id: 'g_'+Date.now(), name, emoji: selectedGroupEmoji, total: 0, members: allMembers, expenses: [], balances: [] };
    if (isDemoMode) DEMO_GROUPS.push(newGroup);
    else { allGroups.push(newGroup); }
  }

  closeModal('groupModal');
  showToast(`Group "${name}" created! 🎉`, 'success');
  renderGroups();
}

// ── GROUP DETAIL ──────────────────────────────────
function openGroupDetail(groupId) {
  currentGroupId = groupId;
  const groups = isDemoMode ? DEMO_GROUPS : allGroups;
  const g = groups.find(x => x._id === groupId);
  if (!g) return;

  document.getElementById('gdpEmoji').textContent = g.emoji || '👥';
  document.getElementById('gdpName').textContent = g.name;
  document.getElementById('gdpMeta').textContent = `${(g.members||[]).length} members · ₹${(g.total||0).toLocaleString('en-IN')} total`;

  switchGdpTab('balances', document.querySelector('.gdp-tab'));
  renderGdpBalances(g);
  renderGdpExpenses(g);
  renderGdpMembers(g);

  document.getElementById('groupDetailOverlay').classList.add('open');
}

function closeGroupDetail() {
  document.getElementById('groupDetailOverlay').classList.remove('open');
  currentGroupId = null;
}

function switchGdpTab(tab, el) {
  document.querySelectorAll('.gdp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.gdp-tab-content').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  else document.querySelector('.gdp-tab')?.classList.add('active');
  const content = document.getElementById('gdpTab-' + tab);
  if (content) content.classList.add('active');
}

function renderGdpBalances(g) {
  const MEMBER_COLORS = ['#8b5cf6','#3b82f6','#10b981','#f97316','#ec4899','#06b6d4'];
  const members = g.members || [];
  const balances = g.balances || [];

  // Net per member
  const net = {};
  members.forEach(m => net[m] = 0);
  (g.expenses || []).forEach(({ amount, paidBy, splitAmong }) => {
    const among = splitAmong && splitAmong.length ? splitAmong : members;
    const share = amount / among.length;
    net[paidBy] = (net[paidBy] || 0) + amount;
    among.forEach(m => net[m] = (net[m] || 0) - share);
  });

  const mbalGrid = document.getElementById('gdpMemberBalances');
  mbalGrid.innerHTML = members.map((m, i) => {
    const bal = Math.round((net[m] || 0) * 100) / 100;
    const color = MEMBER_COLORS[i % MEMBER_COLORS.length];
    const balColor = bal > 0 ? 'var(--accent-green)' : bal < 0 ? 'var(--accent-red)' : 'var(--text-muted)';
    const balText = bal > 0 ? `gets back ₹${bal.toLocaleString('en-IN')}` : bal < 0 ? `owes ₹${Math.abs(bal).toLocaleString('en-IN')}` : 'settled';
    return `
      <div class="mbal-card">
        <div class="mbal-avatar" style="background:${color};">${m.charAt(0).toUpperCase()}</div>
        <div style="flex:1;min-width:0;">
          <div class="mbal-name">${m}</div>
          <div class="mbal-amount" style="color:${balColor};">${balText}</div>
        </div>
      </div>`;
  }).join('');

  const settleDiv = document.getElementById('gdpSettlements');
  if (!balances.length) {
    settleDiv.innerHTML = `<div class="balance-settled">✅ Nothing to settle!</div>`;
    return;
  }
  settleDiv.innerHTML = balances.map(b => `
    <div class="balance-row">
      <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
        <strong>${b.from}</strong>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        <strong>${b.to}</strong>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="owe-badge">₹${Number(b.amount).toLocaleString('en-IN')}</span>
        <button type="button" class="settle-btn" onclick="settleBalance('${currentGroupId}','${b.from}','${b.to}',${b.amount})">Settle</button>
      </div>
    </div>`).join('');
}

function renderGdpExpenses(g) {
  const expDiv = document.getElementById('gdpExpenseList');
  const expenses = g.expenses || [];
  if (!expenses.length) {
    expDiv.innerHTML = `<div class="empty-state" style="padding:32px 16px;"><div class="empty-icon" style="font-size:32px;">📋</div><div class="empty-title" style="font-size:14px;">No expenses yet</div></div>`;
    return;
  }
  expDiv.innerHTML = [...expenses].reverse().map(e => {
    const date = new Date(e.date || Date.now()).toLocaleDateString('en-IN', {day:'numeric',month:'short'});
    const among = e.splitAmong || g.members || [];
    return `
      <div class="gexp-item">
        <div class="gexp-icon" style="background:rgba(139,92,246,0.15);">💸</div>
        <div style="flex:1;min-width:0;">
          <div class="gexp-title">${e.title}</div>
          <div class="gexp-meta">Paid by <strong>${e.paidBy}</strong> · Split ${among.length} ways · ${date}</div>
        </div>
        <div class="gexp-amount" style="color:var(--accent-purple);">₹${Number(e.amount).toLocaleString('en-IN')}</div>
      </div>`;
  }).join('');
}

function renderGdpMembers(g) {
  const MEMBER_COLORS = ['#8b5cf6','#3b82f6','#10b981','#f97316','#ec4899','#06b6d4'];
  const listDiv = document.getElementById('gdpMemberList');
  listDiv.innerHTML = (g.members||[]).map((m, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;">
      <div style="width:36px;height:36px;border-radius:10px;background:${MEMBER_COLORS[i%MEMBER_COLORS.length]};display:flex;align-items:center;justify-content:center;font-weight:700;color:white;">${m.charAt(0).toUpperCase()}</div>
      <span style="font-size:14px;font-weight:600;flex:1;">${m}</span>
      ${i > 0 ? `<button type="button" class="settle-btn" style="background:rgba(239,68,68,0.12);color:var(--accent-red);border-color:rgba(239,68,68,0.25);" onclick="removeMemberFromGroup('${g._id}','${m}')">Remove</button>` : '<span style="font-size:11px;color:var(--text-muted);padding:4px 8px;background:rgba(139,92,246,0.1);border-radius:6px;">Admin</span>'}
    </div>`).join('');
}

// ── ADD GROUP EXPENSE ─────────────────────────────
function openAddGroupExpense(groupId) {
  currentGroupId = groupId;
  const groups = isDemoMode ? DEMO_GROUPS : allGroups;
  const g = groups.find(x => x._id === groupId);
  if (!g) return;

  document.getElementById('geGroupId').value = groupId;
  document.getElementById('geTitle').value = '';
  document.getElementById('geAmount').value = '';
  document.getElementById('geSplitPreview').textContent = '₹0';

  // Paid by options
  const paidByEl = document.getElementById('gePaidBy');
  paidByEl.innerHTML = (g.members||[]).map(m => `<option value="${m}">${m}</option>`).join('');

  // Split among checkboxes
  const splitDiv = document.getElementById('geSplitAmong');
  splitDiv.innerHTML = (g.members||[]).map(m => `
    <label class="member-checkbox">
      <input type="checkbox" value="${m}" checked onchange="updateSplitPreview()"> ${m}
    </label>`).join('');

  closeGroupDetail();
  openModal('groupExpenseModal');
  setTimeout(() => document.getElementById('geTitle').focus(), 150);
}

function updateSplitPreview() {
  const amount = parseFloat(document.getElementById('geAmount').value) || 0;
  const checked = document.querySelectorAll('#geSplitAmong input:checked');
  const count = checked.length || 1;
  document.getElementById('geSplitPreview').textContent = '₹' + (amount / count).toLocaleString('en-IN', {minimumFractionDigits:2,maximumFractionDigits:2});
}

async function saveGroupExpense() {
  const groupId = document.getElementById('geGroupId').value;
  const title = document.getElementById('geTitle').value.trim();
  const amount = parseFloat(document.getElementById('geAmount').value);
  const paidBy = document.getElementById('gePaidBy').value;
  const splitAmong = [...document.querySelectorAll('#geSplitAmong input:checked')].map(c => c.value);

  if (!title) { showToast('Enter a title', 'error'); return; }
  if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
  if (!splitAmong.length) { showToast('Select at least one person to split with', 'error'); return; }

  try {
    const res = await fetch(`${url}/group/${groupId}/expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount, paidBy, splitAmong })
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    // Update in allGroups
    const idx = allGroups.findIndex(g => g._id === groupId);
    if (idx !== -1) allGroups[idx] = data;
    isDemoMode = false;
  } catch {
    // Update demo/local
    const groups = isDemoMode ? DEMO_GROUPS : allGroups;
    const g = groups.find(x => x._id === groupId);
    if (g) {
      if (!g.expenses) g.expenses = [];
      g.expenses.push({ title, amount, paidBy, splitAmong, date: new Date().toISOString() });
      g.total = (g.total || 0) + amount;
      g.balances = calcLocalBalances(g);
    }
  }

  closeModal('groupExpenseModal');
  showToast(`₹${amount.toLocaleString('en-IN')} added! 💰`, 'success');
  renderGroups();
}

// ── LOCAL BALANCE CALC (mirrors backend) ──────────
function calcLocalBalances(g) {
  const net = {};
  (g.members||[]).forEach(m => net[m] = 0);
  (g.expenses||[]).forEach(({ amount, paidBy, splitAmong }) => {
    const among = splitAmong && splitAmong.length ? splitAmong : g.members;
    const share = amount / among.length;
    net[paidBy] = (net[paidBy]||0) + amount;
    among.forEach(m => net[m] = (net[m]||0) - share);
  });
  const creditors = [], debtors = [];
  Object.entries(net).forEach(([name, bal]) => {
    if (bal > 0.01) creditors.push({ name, bal });
    else if (bal < -0.01) debtors.push({ name, bal: -bal });
  });
  const balances = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].bal, creditors[j].bal);
    balances.push({ from: debtors[i].name, to: creditors[j].name, amount: Math.round(pay * 100) / 100 });
    debtors[i].bal -= pay; creditors[j].bal -= pay;
    if (debtors[i].bal < 0.01) i++;
    if (creditors[j].bal < 0.01) j++;
  }
  return balances;
}

// ── SETTLE BALANCE ────────────────────────────────
async function settleBalance(groupId, from, to, amount) {
  if (!confirm(`Mark ₹${amount} from ${from} to ${to} as settled?`)) return;
  try {
    await fetch(`${url}/group/${groupId}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, amount })
    });
  } catch {}
  // Update locally
  const groups = isDemoMode ? DEMO_GROUPS : allGroups;
  const g = groups.find(x => x._id === groupId);
  if (g) {
    g.balances = (g.balances||[]).filter(b => !(b.from===from && b.to===to));
    // Add a settlement expense
    if (!g.expenses) g.expenses = [];
    g.expenses.push({ title: `Settlement: ${from} → ${to}`, amount, paidBy: from, splitAmong: [to], date: new Date().toISOString() });
  }
  showToast(`Settled ₹${amount} from ${from} to ${to} ✅`, 'success');
  if (currentGroupId === groupId) openGroupDetail(groupId);
  renderGroups();
}

// ── DELETE GROUP ──────────────────────────────────
async function deleteGroup(groupId) {
  if (!confirm('Delete this group and all its expenses? This cannot be undone.')) return;
  try {
    await fetch(`${url}/group/${groupId}`, { method: 'DELETE' });
  } catch {}
  if (isDemoMode) {
    const idx = DEMO_GROUPS.findIndex(g => g._id === groupId);
    if (idx !== -1) DEMO_GROUPS.splice(idx, 1);
  } else {
    allGroups = allGroups.filter(g => g._id !== groupId);
  }
  closeGroupDetail();
  showToast('Group deleted', 'info');
  renderGroups();
}

// ── ADD MEMBER TO EXISTING GROUP ──────────────────
async function addMemberToGroup() {
  const name = document.getElementById('newMemberName').value.trim();
  if (!name) { showToast('Enter a name', 'error'); return; }
  const groups = isDemoMode ? DEMO_GROUPS : allGroups;
  const g = groups.find(x => x._id === currentGroupId);
  if (!g) return;
  if (g.members.includes(name)) { showToast('Member already exists', 'error'); return; }

  try {
    await fetch(`${url}/group/${currentGroupId}/member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  } catch {}
  g.members.push(name);
  document.getElementById('newMemberName').value = '';
  showToast(`${name} added to group ✅`, 'success');
  renderGdpMembers(g);
  renderGroups();
}

async function removeMemberFromGroup(groupId, name) {
  if (!confirm(`Remove ${name} from group?`)) return;
  const groups = isDemoMode ? DEMO_GROUPS : allGroups;
  const g = groups.find(x => x._id === groupId);
  if (!g) return;
  g.members = g.members.filter(m => m !== name);
  try {
    await fetch(`${url}/group/${groupId}/member/${encodeURIComponent(name)}`, { method: 'DELETE' });
  } catch {}
  showToast(`${name} removed`, 'info');
  renderGdpMembers(g);
  renderGroups();
}

// ─── INSIGHTS ─────────────────────────────────────
function renderInsights() {
  const container = document.getElementById('insightsGrid');
  if (!container) return;
  const insights = generateInsights(allTransactions);
  container.innerHTML = insights.map((ins, i) => `
    <div class="insight-card" style="animation-delay:${i*0.08}s;">
      <div class="insight-icon" style="background:${ins.bg};">${ins.icon}</div>
      <div class="insight-text">
        <div class="insight-title">${ins.title}</div>
        <div class="insight-desc">${ins.desc}</div>
      </div>
    </div>
  `).join('');
}

function generateInsights(txs) {
  const insights = [];
  let income = 0, expense = 0;
  const catMap = {};
  txs.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else { expense += t.amount; catMap[t.category] = (catMap[t.category]||0) + t.amount; }
  });
  const savings = income - expense;
  const savingsRate = income > 0 ? (savings/income)*100 : 0;
  const topCat = Object.entries(catMap).sort((a,b)=>b[1]-a[1])[0];

  if (savings > 0) insights.push({ icon:'🎉', bg:'rgba(16,185,129,0.15)', title:`You saved ₹${savings.toLocaleString('en-IN')}!`, desc:`That's a ${savingsRate.toFixed(1)}% savings rate. Keep it up!` });
  if (topCat) insights.push({ icon:'📊', bg:'rgba(249,115,22,0.15)', title:`Top spend: ${topCat[0]}`, desc:`You spent ₹${topCat[1].toLocaleString('en-IN')} on ${topCat[0]} this period.` });
  if (savingsRate < 20 && income > 0) insights.push({ icon:'⚠️', bg:'rgba(239,68,68,0.15)', title:'Low savings rate', desc:'Try to save at least 20% of your income. Consider cutting discretionary spending.' });
  if (savingsRate >= 30) insights.push({ icon:'🚀', bg:'rgba(139,92,246,0.15)', title:'Excellent savings!', desc:`A ${savingsRate.toFixed(1)}% savings rate puts you ahead of most people. Consider investing!` });
  const foodAmt = catMap['Food'] || 0;
  if (foodAmt > income * 0.15) insights.push({ icon:'🍕', bg:'rgba(249,115,22,0.15)', title:'Food spending is high', desc:`₹${foodAmt.toLocaleString('en-IN')} on food is ${((foodAmt/income)*100).toFixed(0)}% of income. Try cooking more at home.` });
  const entAmt = catMap['Entertainment'] || 0;
  if (entAmt > 2000) insights.push({ icon:'🎬', bg:'rgba(139,92,246,0.15)', title:'Entertainment check', desc:`You spent ₹${entAmt.toLocaleString('en-IN')} on entertainment. Review your subscriptions.` });
  if (!insights.length) insights.push({ icon:'💡', bg:'rgba(59,130,246,0.15)', title:'Start tracking!', desc:'Add transactions to get personalized spending insights and tips.' });
  return insights;
}

// ─── MODAL HELPERS ────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ─── RIPPLE EFFECT ────────────────────────────────
function addRipple(el) {
  el.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// Add ripple to all buttons
document.querySelectorAll('.btn').forEach(addRipple);

// ─── TOAST ────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function logout() {
  localStorage.removeItem('user');
  window.location = 'login.html';
}
