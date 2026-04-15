'use strict';

// ── State ──────────────────────────────────────────────────────────────────
const PROTOCOL_META = [
  { id:'uniswap', name:'Uniswap v3', tag:'DEX',    color:'#378ADD', dash:[]        },
  { id:'aave',    name:'Aave v3',    tag:'Lending', color:'#1D9E75', dash:[6,3]     },
  { id:'sushi',   name:'SushiSwap',  tag:'DEX',     color:'#EF9F27', dash:[3,3]     },
  { id:'curve',   name:'Curve',      tag:'AMM',     color:'#D85A30', dash:[8,4]     },
  { id:'compound',name:'Compound',   tag:'Lending', color:'#7F77DD', dash:[5,2]     },
];

const BASE_DATA = {
  uniswap:  { gini:0.22, hhi:2150, entropy:6.42, cdi:0.43 },
  aave:     { gini:0.25, hhi:2300, entropy:6.20, cdi:0.44 },
  sushi:    { gini:0.20, hhi:1950, entropy:6.55, cdi:0.42 },
  curve:    { gini:0.18, hhi:1800, entropy:6.70, cdi:0.41 },
  compound: { gini:0.24, hhi:2200, entropy:6.30, cdi:0.43 },
};

const TOKEN_META = [
  { sym:'UNI',  name:'Uniswap',   base:7.82,  color:'#378ADD', bg:'#0d2440', fg:'#5aadff' },
  { sym:'AAVE', name:'Aave',      base:88.40, color:'#1D9E75', bg:'#0d2b22', fg:'#3dd6a3' },
  { sym:'SUSHI',name:'SushiSwap', base:1.12,  color:'#EF9F27', bg:'#2b200a', fg:'#f5b94d' },
  { sym:'CRV',  name:'Curve',     base:0.34,  color:'#D85A30', bg:'#2b150a', fg:'#f58a60' },
  { sym:'COMP', name:'Compound',  base:44.10, color:'#7F77DD', bg:'#1e1b3a', fg:'#aaa4f5' },
];

let protoData = PROTOCOL_META.map(p => ({ ...p, ...BASE_DATA[p.id] }));
let tokenPrices = TOKEN_META.map(t => ({
  ...t,
  price: t.base,
  prevPrice: t.base,
  hist: Array.from({length:24}, () => t.base * (1 + (Math.random()-.5)*.04)),
}));

let visible = Object.fromEntries(PROTOCOL_META.map(p => [p.id, true]));
let cdiChart = null;
let radarChart = null;
let cdiSeries = {};
let refreshInterval = 30;
let countdown = 30;
let countdownTimer = null;
let priceTimer = null;

// ── Helpers ─────────────────────────────────────────────────────────────────
function jitter(v, pct = 0.018) {
  return parseFloat((v + (Math.random() - 0.5) * v * pct * 2).toFixed(4));
}

function genSeries(baseVal, n = 90) {
  let v = baseVal;
  return Array.from({length: n}, () => {
    v = Math.max(0.35, Math.min(0.55, v + (Math.random() - 0.5) * 0.007));
    return parseFloat(v.toFixed(4));
  });
}

function dateLabels(n = 90) {
  return Array.from({length: n}, (_, i) => {
    const d = new Date(2024, 0, 1);
    d.setDate(d.getDate() + i);
    return i % 14 === 0
      ? d.toLocaleDateString('en-US', {month:'short', day:'numeric'})
      : '';
  });
}

function riskLabel(cdi) {
  if (cdi < 0.39) return ['High', 'risk-high'];
  if (cdi < 0.46) return ['Mod', 'risk-mod'];
  return ['Low', 'risk-low'];
}

function fmt(n, dec = 3) { return parseFloat(n).toFixed(dec); }

// ── Init time series ─────────────────────────────────────────────────────────
PROTOCOL_META.forEach(p => { cdiSeries[p.id] = genSeries(BASE_DATA[p.id].cdi); });

// ── Charts ──────────────────────────────────────────────────────────────────
function buildCDIChart() {
  const ctx = document.getElementById('cdiChart');
  const datasets = PROTOCOL_META.map(p => ({
    label: p.name,
    data: cdiSeries[p.id],
    borderColor: p.color,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderDash: p.dash,
    pointRadius: 0,
    tension: 0.4,
    hidden: !visible[p.id],
  }));

  cdiChart = new Chart(ctx, {
    type: 'line',
    data: { labels: dateLabels(), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#1a1d32',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          titleColor: '#9095b0',
          bodyColor: '#e8eaf0',
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(3)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a5f7a', font: {size:10}, maxRotation: 0 }
        },
        y: {
          min: 0.32, max: 0.58,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5a5f7a', font: {size:10}, callback: v => v.toFixed(2) }
        }
      },
      interaction: { mode:'index', intersect:false }
    }
  });
}

function buildRadarChart() {
  const ctx = document.getElementById('radarChart');
  const labels = ['Gini (norm)', 'HHI (norm)', 'Entropy (norm)'];

  const datasets = protoData.map(p => ({
    label: p.name,
    data: [
      parseFloat((p.gini / 0.3).toFixed(3)),
      parseFloat((p.hhi / 5000).toFixed(3)),
      parseFloat((p.entropy / 8).toFixed(3)),
    ],
    borderColor: p.color,
    backgroundColor: p.color + '22',
    borderWidth: 1.5,
    pointRadius: 3,
    pointBackgroundColor: p.color,
  }));

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 1,
          grid: { color: 'rgba(255,255,255,0.07)' },
          angleLines: { color: 'rgba(255,255,255,0.07)' },
          pointLabels: { color: '#9095b0', font: {size: 11} },
          ticks: { display: false, stepSize: 0.25 }
        }
      }
    }
  });
}

// ── Protocol toggles ─────────────────────────────────────────────────────────
function buildProtoToggles() {
  const wrap = document.getElementById('proto-btns');
  const legend = document.getElementById('chart-legend');
  wrap.innerHTML = PROTOCOL_META.map(p => `
    <button
      class="proto-btn active"
      style="--pc:${p.color}"
      data-id="${p.id}"
      onclick="toggleProto('${p.id}', this)"
    >${p.name}</button>
  `).join('');

  legend.innerHTML = PROTOCOL_META.map(p => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${p.color}"></div>
      <span>${p.name}</span>
    </div>
  `).join('');
}

function toggleProto(id, btn) {
  visible[id] = !visible[id];
  btn.classList.toggle('active', visible[id]);
  cdiChart.data.datasets.forEach(ds => {
    const meta = PROTOCOL_META.find(p => p.name === ds.label);
    if (meta && meta.id === id) ds.hidden = !visible[id];
  });
  cdiChart.update();
}

// ── Render protocol table ────────────────────────────────────────────────────
function renderProtoTable() {
  const sorted = [...protoData].sort((a, b) => b.cdi - a.cdi);
  document.getElementById('proto-rows').innerHTML = sorted.map((p, i) => {
    const [rl, rc] = riskLabel(p.cdi);
    const barW = Math.round(p.cdi * 100);
    return `
      <tr>
        <td><span class="rank-num">${i + 1}</span></td>
        <td>
          <div class="proto-name-cell">
            <div class="name">${p.name}</div>
            <div class="tag">${p.tag}</div>
          </div>
        </td>
        <td>
          <div class="cdi-cell">
            <div class="cdi-bar-bg">
              <div class="cdi-bar-fg" style="width:${barW}%;background:${p.color}"></div>
            </div>
            <span class="cdi-num">${fmt(p.cdi)}</span>
          </div>
        </td>
        <td><span class="gini-num">${fmt(p.gini)}</span></td>
        <td><span class="entropy-num">${fmt(p.entropy, 2)}</span></td>
        <td><span class="risk-pill ${rc}">${rl}</span></td>
      </tr>`;
  }).join('');
}

// ── Render prices ───────────────────────────────────────────────────────────
function buildSparkPath(hist) {
  const mn = Math.min(...hist), mx = Math.max(...hist), rng = mx - mn || 0.001;
  return hist.map((v, i) => {
    const x = (i / (hist.length - 1)) * 86 + 1;
    const y = 28 - ((v - mn) / rng) * 24;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function renderPrices() {
  document.getElementById('price-list').innerHTML = tokenPrices.map(t => {
    const chg = ((t.price - t.base) / t.base * 100).toFixed(2);
    const isUp = parseFloat(chg) >= 0;
    const spark = buildSparkPath(t.hist);
    const fmtPrice = t.price < 1
      ? t.price.toFixed(4)
      : t.price < 10
        ? t.price.toFixed(3)
        : t.price.toFixed(2);

    return `
      <div class="price-row">
        <div class="price-token">
          <div class="token-icon" style="background:${t.bg};color:${t.fg}">${t.sym.slice(0,2)}</div>
          <div>
            <div class="tok-name">${t.sym}</div>
            <div class="tok-sub">${t.name}</div>
          </div>
        </div>
        <svg class="mini-spark" viewBox="0 0 88 32" preserveAspectRatio="none">
          <path d="${spark}" fill="none" stroke="${t.color}" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="price-right">
          <div class="price-usd">$${fmtPrice}</div>
          <div class="price-chg ${isUp ? 'up' : 'down'}">${isUp ? '▲' : '▼'} ${Math.abs(chg)}%</div>
        </div>
      </div>`;
  }).join('');
}

// ── Render paradox ───────────────────────────────────────────────────────────
function renderParadox() {
  document.getElementById('paradox-list').innerHTML = protoData.map(p => {
    const ops  = Math.round((p.entropy / 8) * 100);
    const gov  = Math.round(p.gini * 100);
    const gap  = ops - gov;
    const gapColor = gap > 40 ? '#E24B4A' : gap > 30 ? '#EF9F27' : '#1D9E75';
    return `
      <div class="paradox-item">
        <div class="paradox-meta">
          <span class="paradox-proto">${p.name}</span>
          <span class="paradox-gap" style="color:${gapColor}">Gap ${gap}pt</span>
        </div>
        <div class="dual-bar">
          <div class="dual-ops" style="width:${ops}%;background:${p.color}"></div>
          <div class="dual-gov" style="width:${gov}%"></div>
        </div>
        <div class="dual-labels">
          <span>Operational ${ops}%</span>
          <span>Governance ${gov}%</span>
        </div>
      </div>`;
  }).join('');
}

// ── Render metric cards ───────────────────────────────────────────────────────
function renderMetricCards() {
  const avg = key => protoData.reduce((s, p) => s + p[key], 0) / protoData.length;
  const avgCDI     = avg('cdi');
  const avgGini    = avg('gini');
  const avgEntropy = avg('entropy');
  const avgHHI     = avg('hhi');

  document.getElementById('avg-cdi').textContent     = fmt(avgCDI);
  document.getElementById('avg-gini').textContent    = fmt(avgGini);
  document.getElementById('avg-entropy').textContent = fmt(avgEntropy, 2);
  document.getElementById('avg-hhi').textContent     = Math.round(avgHHI).toLocaleString();

  const interp = avgCDI < 0.3 ? 'Highly Centralized' : avgCDI < 0.6 ? 'Moderately Decentralized' : 'Highly Decentralized';
  document.getElementById('cdi-interp').textContent  = interp;

  document.getElementById('cdi-fill').style.width     = (avgCDI * 100) + '%';
  document.getElementById('gini-fill').style.width    = (avgGini * 100) + '%';
  document.getElementById('entropy-fill').style.width = ((avgEntropy / 8) * 100) + '%';
  document.getElementById('hhi-fill').style.width     = ((avgHHI / 10000) * 100) + '%';
}

// ── Data refresh ─────────────────────────────────────────────────────────────
function fullRefresh() {
  // Jitter proto data
  protoData = protoData.map(p => {
    const b = BASE_DATA[p.id];
    return {
      ...p,
      gini:    jitter(b.gini, 0.025),
      hhi:     Math.round(jitter(b.hhi, 0.02)),
      entropy: jitter(b.entropy, 0.018),
      cdi:     jitter(b.cdi, 0.02),
    };
  });

  // Extend CDI time series (rolling)
  PROTOCOL_META.forEach(p => {
    const proto = protoData.find(d => d.id === p.id);
    const last = cdiSeries[p.id][cdiSeries[p.id].length - 1];
    const newVal = Math.max(0.36, Math.min(0.54, last + (Math.random() - 0.5) * 0.008));
    cdiSeries[p.id] = [...cdiSeries[p.id].slice(1), parseFloat(newVal.toFixed(4))];
    const ds = cdiChart.data.datasets.find(d => d.label === p.name);
    if (ds) ds.data = cdiSeries[p.id];
  });

  cdiChart.update('none');

  // Update radar
  radarChart.data.datasets.forEach(ds => {
    const p = protoData.find(d => d.name === ds.label);
    if (p) ds.data = [
      parseFloat((p.gini / 0.3).toFixed(3)),
      parseFloat((p.hhi / 5000).toFixed(3)),
      parseFloat((p.entropy / 8).toFixed(3)),
    ];
  });
  radarChart.update('none');

  renderProtoTable();
  renderMetricCards();
  renderParadox();

  document.getElementById('last-update-time').textContent =
    new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit'});

  countdown = refreshInterval;
}

function tickPrices() {
  tokenPrices = tokenPrices.map(t => {
    const newP = Math.max(t.base * 0.5, t.price * (1 + (Math.random() - 0.5) * 0.007));
    return { ...t, prevPrice: t.price, price: newP, hist: [...t.hist.slice(1), newP] };
  });
  renderPrices();
}

// ── Countdown ring ────────────────────────────────────────────────────────────
const RING_CIRC = 87.96;
function updateRing() {
  const frac = countdown / refreshInterval;
  const offset = RING_CIRC * (1 - frac);
  document.getElementById('ring-circle').setAttribute('stroke-dashoffset', offset.toFixed(2));
  document.getElementById('countdown-num').textContent = countdown;
}

function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdown = refreshInterval;
  countdownTimer = setInterval(() => {
    countdown = Math.max(0, countdown - 1);
    updateRing();
    if (countdown === 0) {
      fullRefresh();
      countdown = refreshInterval;
    }
  }, 1000);
}

// ── Refresh interval control ──────────────────────────────────────────────────
function setRefreshInterval(val) {
  refreshInterval = parseInt(val);
  startCountdown();
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
function setupNavHighlight() {
  const sections = ['overview','protocols','prices','paradox'];
  const items = document.querySelectorAll('.nav-item');
  window.addEventListener('scroll', () => {
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 160) current = id;
    });
    items.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + current);
    });
  }, {passive: true});
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildProtoToggles();
  buildCDIChart();
  buildRadarChart();
  renderProtoTable();
  renderPrices();
  renderParadox();
  renderMetricCards();
  setupNavHighlight();
  startCountdown();

  document.getElementById('last-update-time').textContent =
    new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit'});

  // Price tick every 3 seconds
  priceTimer = setInterval(tickPrices, 3000);
});
