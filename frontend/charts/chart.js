// ─── CHART.JS ADVANCED CONFIG ────────────────────
// FinTrak Premium Charts

const CHART_COLORS = {
  purple: '#8b5cf6',
  blue: '#3b82f6',
  cyan: '#06b6d4',
  orange: '#f97316',
  green: '#10b981',
  red: '#ef4444',
  pink: '#ec4899',
  yellow: '#eab308',
};

const CATEGORY_COLORS = {
  'Food': { color: '#f97316', emoji: '🍕' },
  'Transport': { color: '#3b82f6', emoji: '🚗' },
  'Shopping': { color: '#ec4899', emoji: '🛍' },
  'Entertainment': { color: '#8b5cf6', emoji: '🎬' },
  'Health': { color: '#10b981', emoji: '❤️' },
  'Bills': { color: '#ef4444', emoji: '🧾' },
  'Education': { color: '#06b6d4', emoji: '📚' },
  'Travel': { color: '#eab308', emoji: '✈️' },
  'Salary': { color: '#10b981', emoji: '💼' },
  'Investment': { color: '#6d28d9', emoji: '📈' },
  'Other': { color: '#64748b', emoji: '📦' },
};

function getCatColor(cat) {
  return CATEGORY_COLORS[cat]?.color || '#64748b';
}
function getCatEmoji(cat) {
  return CATEGORY_COLORS[cat]?.emoji || '📦';
}

function getChartDefaults() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    textColor: isDark ? '#8892a4' : '#4a5568',
    gridColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    tooltipBg: isDark ? '#0d1220' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  };
}

// ─── LINE CHART (Monthly Trends) ─────────────────
let lineChartInst;
function drawLineChart(monthlyData) {
  const ctx = document.getElementById('lineChart');
  if (!ctx) return;
  if (lineChartInst) lineChartInst.destroy();

  const d = getChartDefaults();
  const labels = monthlyData.map(m => m.month);
  const incomeData = monthlyData.map(m => m.income);
  const expenseData = monthlyData.map(m => m.expense);

  function makeGradient(ctx, color) {
    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');
    return grad;
  }

  lineChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: CHART_COLORS.green,
          backgroundColor: function(context) {
            const chart = context.chart;
            const { ctx: c } = chart;
            return makeGradient(c, '#10b981');
          },
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointBackgroundColor: CHART_COLORS.green,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Expense',
          data: expenseData,
          borderColor: CHART_COLORS.red,
          backgroundColor: function(context) {
            const chart = context.chart;
            const { ctx: c } = chart;
            return makeGradient(c, '#ef4444');
          },
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointBackgroundColor: CHART_COLORS.red,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      animation: { duration: 1200, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: d.tooltipBg,
          borderColor: d.tooltipBorder,
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892a4',
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: d.gridColor },
          ticks: { color: d.textColor, font: { size: 12, family: 'Inter' } },
          border: { display: false }
        },
        y: {
          grid: { color: d.gridColor },
          ticks: {
            color: d.textColor, font: { size: 12, family: 'Inter' },
            callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v)
          },
          border: { display: false }
        }
      }
    }
  });
}

// ─── DONUT CHART (Category) ───────────────────────
let donutChartInst;
function drawDonutChart(transactions) {
  const ctx = document.getElementById('donutChart');
  if (!ctx) return;
  if (donutChartInst) donutChartInst.destroy();

  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const cat = t.category || 'Other';
    map[cat] = (map[cat] || 0) + t.amount;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);
  const colors = labels.map(l => getCatColor(l));
  const d = getChartDefaults();

  donutChartInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      animation: { animateRotate: true, duration: 1000 },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: d.textColor,
            font: { size: 12, family: 'Inter' },
            padding: 14,
            usePointStyle: true,
            pointStyleWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: d.tooltipBg,
          borderColor: d.tooltipBorder,
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892a4',
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: ctx => ` ₹${ctx.raw.toLocaleString('en-IN')} (${((ctx.raw / values.reduce((a,b)=>a+b,0))*100).toFixed(1)}%)`
          }
        }
      }
    }
  });
}

// ─── BAR CHART (Monthly Comparison) ──────────────
let barChartInst;
function drawBarChart(monthlyData) {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;
  if (barChartInst) barChartInst.destroy();

  const d = getChartDefaults();

  barChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthlyData.map(m => m.month),
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(m => m.income),
          backgroundColor: '#10b98133',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Expense',
          data: monthlyData.map(m => m.expense),
          backgroundColor: '#ef444433',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: d.textColor, font: { size: 12, family: 'Inter' }, usePointStyle: true, pointStyleWidth: 8 }
        },
        tooltip: {
          backgroundColor: d.tooltipBg,
          borderColor: d.tooltipBorder,
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892a4',
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ₹${ctx.raw.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: d.textColor, font: { size: 12, family: 'Inter' } },
          border: { display: false }
        },
        y: {
          grid: { color: d.gridColor },
          ticks: {
            color: d.textColor, font: { size: 12, family: 'Inter' },
            callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v)
          },
          border: { display: false }
        }
      }
    }
  });
}

// ─── SAVINGS LINE MINI ────────────────────────────
let savingsChartInst;
function drawSavingsChart(monthlyData) {
  const ctx = document.getElementById('savingsChart');
  if (!ctx) return;
  if (savingsChartInst) savingsChartInst.destroy();

  const savings = monthlyData.map(m => Math.max(0, m.income - m.expense));
  const d = getChartDefaults();

  savingsChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthlyData.map(m => m.month),
      datasets: [{
        data: savings,
        borderColor: '#8b5cf6',
        backgroundColor: function(context) {
          const { ctx: c, chartArea } = context.chart;
          if (!chartArea) return 'transparent';
          const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, '#8b5cf640');
          grad.addColorStop(1, '#8b5cf600');
          return grad;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000 },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ₹' + ctx.raw.toLocaleString('en-IN') } } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// ─── REFRESH ALL CHARTS ───────────────────────────
function refreshCharts(transactions) {
  const monthly = buildMonthlyData(transactions);
  drawLineChart(monthly);
  drawDonutChart(transactions);
  drawBarChart(monthly);
  drawSavingsChart(monthly);
}

// ─── BUILD MONTHLY DATA ───────────────────────────
function buildMonthlyData(transactions) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const map = {};
  months.forEach(m => map[m] = { month: m, income: 0, expense: 0 });

  transactions.forEach(t => {
    const date = new Date(t.date || t.createdAt || Date.now());
    const mon = months[date.getMonth()];
    if (map[mon]) {
      if (t.type === 'income') map[mon].income += t.amount;
      else map[mon].expense += t.amount;
    }
  });

  // Return last 6 months
  const now = new Date();
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(map[months[d.getMonth()]]);
  }
  return result;
}
