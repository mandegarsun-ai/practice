const API = 'http://127.0.0.1:3000/api';

async function loadStats() {
  try {
    const res = await fetch(API + '/stats');
    const data = await res.json();
    const t = document.getElementById('totalChats');
    const r = document.getElementById('resolvedToday');
    if(t) t.textContent = data.total_chats;
    if(r) r.textContent = data.resolved;
  } catch(e) { console.log('API error', e); }
}

/* ── Screens ── */
function showScreen(n) {
  ['loginScreen', 'signupScreen'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById('dashboard').classList.remove('active');
  if (n === 'login')  document.getElementById('loginScreen').classList.add('active');
  if (n === 'signup') document.getElementById('signupScreen').classList.add('active');
  if (n === 'dash')   { document.getElementById('dashboard').classList.add('active'); loadStats(); }
}

/* ── Login ── */
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginErr');
  if (!email || !pass) { err.classList.add('show'); return; }
  err.classList.remove('show');
  const stored = localStorage.getItem('opoName');
  const name = stored || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  setAgent(name);
  showScreen('dash');
  setTimeout(showToast, 3000);
}

/* ── Signup ── */
function doSignup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPass').value;
  const err   = document.getElementById('signupErr');
  const ok    = document.getElementById('signupOk');
  if (!name || !email || !pass) { err.classList.add('show'); ok.classList.remove('show'); return; }
  err.classList.remove('show');
  localStorage.setItem('opoName', name);
  ok.classList.add('show');
  setTimeout(() => { ok.classList.remove('show'); showScreen('login'); }, 1600);
}

/* ── Logout ── */
function doLogout() {
  showScreen('login');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value  = '';
}

/* ── Agent ── */
function setAgent(name) {
  document.getElementById('sbName').textContent = name;
  document.getElementById('hName').textContent  = name;
}

/* ── Nav ── */
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

/* ── Toast ── */
let _tt;
function showToast() {
  document.getElementById('toast').classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(hideToast, 5000);
}
function hideToast() {
  document.getElementById('toast').classList.remove('show');
}

/* ── FX Rates ── */
const pairs = [
  { p: 'EUR/USD', b: 1.0854 },
  { p: 'GBP/USD', b: 1.2741 },
  { p: 'USD/JPY', b: 151.62 },
  { p: 'USD/CHF', b: 0.9043 },
  { p: 'AUD/USD', b: 0.6498 },
  { p: 'XAU/USD', b: 2318.50 }
];

function renderRates() {
  const el = document.getElementById('ratesBody');
  if (!el) return;
  el.innerHTML = pairs.map(x => {
    const d   = (Math.random() - .48) * .004;
    const v   = x.b + d;
    const pct = ((d / x.b) * 100).toFixed(3);
    const up  = d >= 0;
    const dec = x.p.includes('JPY') || x.p.includes('XAU') ? 2 : 4;
    return `<div class="rate-row"><span class="rp">${x.p}</span><span class="rv">${v.toFixed(dec)}</span><span class="rc ${up ? 'up' : 'dn'}">${up ? '▲' : '▼'} ${Math.abs(pct)}%</span></div>`;
  }).join('');
}
renderRates();
setInterval(renderRates, 2000);

/* ── Date & Greeting ── */
(function () {
  const d    = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mos  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('hDate').textContent = `${days[d.getDay()]}, ${d.getDate()} ${mos[d.getMonth()]} ${d.getFullYear()}`;
  const h = d.getHours();
  document.getElementById('hGreet').textContent = (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + ' 👋';
})();

/* ── Enter key ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('loginScreen').classList.contains('active'))  doLogin();
  if (document.getElementById('signupScreen').classList.contains('active')) doSignup();
});

/* ── Charts ── */
(function () {
  const tc = '#9ca3af', gc = 'rgba(255,255,255,.06)';
  Chart.defaults.color       = tc;
  Chart.defaults.borderColor = gc;
  Chart.defaults.font.family = "'Segoe UI',system-ui,sans-serif";

  /* Line — Tickets Resolved */
  const lCtx = document.getElementById('chartLine').getContext('2d');
  const grad = lCtx.createLinearGradient(0, 0, 0, 200);
  grad.addColorStop(0, 'rgba(37,99,235,.38)');
  grad.addColorStop(1, 'rgba(37,99,235,0)');
  new Chart(lCtx, {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Resolved',
        data: [8, 12, 7, 15, 11, 17, 14],
        borderColor: '#2563eb',
        backgroundColor: grad,
        borderWidth: 2.5,
        tension: .42,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#1a1a1a',
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: gc }, ticks: { color: tc } },
        y: { grid: { color: gc }, ticks: { color: tc }, beginAtZero: true }
      }
    }
  });

  /* Donut — Categories */
  const dCtx = document.getElementById('chartDonut').getContext('2d');
  new Chart(dCtx, {
    type: 'doughnut',
    data: {
      labels: ['Withdrawal','KYC / Docs','Account Access','Platform','Other'],
      datasets: [{
        data: [34, 22, 18, 15, 11],
        backgroundColor: ['#2563eb','#f59e0b','#10b981','#8b5cf6','#6b7280'],
        borderColor: '#1a1a1a',
        borderWidth: 3,
        hoverOffset: 7,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: true } }
    }
  });

  /* Bar — Response Time + SLA */
  const bCtx = document.getElementById('chartBar').getContext('2d');
  new Chart(bCtx, {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [
        {
          type: 'bar',
          label: 'Avg Response (min)',
          data: [3.2, 2.8, 4.1, 2.2, 1.8, 3.5, 2.1],
          backgroundColor: 'rgba(37,99,235,.52)',
          borderColor: 'rgba(37,99,235,.85)',
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: 'rgba(37,99,235,.78)',
        },
        {
          type: 'line',
          label: 'SLA Target (3 min)',
          data: [3, 3, 3, 3, 3, 3, 3],
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
          tension: 0,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: tc, usePointStyle: true, boxWidth: 10, padding: 16 } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { color: gc }, ticks: { color: tc } },
        y: { grid: { color: gc }, ticks: { color: tc }, beginAtZero: true, suggestedMax: 5 }
      }
    }
  });
})();
