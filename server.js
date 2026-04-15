const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for simulated live data (can be replaced with real on-chain data)
app.get('/api/protocols', (req, res) => {
  const protocols = [
    { id: 'uniswap', name: 'Uniswap v3', tag: 'DEX',     gini: jitter(0.22), hhi: Math.round(jitter(2150, 0.02)), entropy: jitter(6.42), cdi: jitter(0.43), color: '#378ADD' },
    { id: 'aave',    name: 'Aave v3',    tag: 'Lending',  gini: jitter(0.25), hhi: Math.round(jitter(2300, 0.02)), entropy: jitter(6.20), cdi: jitter(0.44), color: '#1D9E75' },
    { id: 'sushi',   name: 'SushiSwap',  tag: 'DEX',      gini: jitter(0.20), hhi: Math.round(jitter(1950, 0.02)), entropy: jitter(6.55), cdi: jitter(0.42), color: '#EF9F27' },
    { id: 'curve',   name: 'Curve',      tag: 'AMM',      gini: jitter(0.18), hhi: Math.round(jitter(1800, 0.02)), entropy: jitter(6.70), cdi: jitter(0.41), color: '#D85A30' },
    { id: 'compound',name: 'Compound',   tag: 'Lending',  gini: jitter(0.24), hhi: Math.round(jitter(2200, 0.02)), entropy: jitter(6.30), cdi: jitter(0.43), color: '#7F77DD' },
  ];
  res.json({ protocols, timestamp: new Date().toISOString() });
});

app.get('/api/prices', (req, res) => {
  const prices = [
    { sym: 'UNI',  name: 'Uniswap',   price: jitter(7.82,  0.008), base: 7.82,  color: '#378ADD', bg: '#E6F1FB', fg: '#0C447C' },
    { sym: 'AAVE', name: 'Aave',       price: jitter(88.40, 0.008), base: 88.40, color: '#1D9E75', bg: '#E1F5EE', fg: '#085041' },
    { sym: 'SUSHI',name: 'SushiSwap',  price: jitter(1.12,  0.008), base: 1.12,  color: '#EF9F27', bg: '#FAEEDA', fg: '#633806' },
    { sym: 'CRV',  name: 'Curve',      price: jitter(0.34,  0.008), base: 0.34,  color: '#D85A30', bg: '#FAECE7', fg: '#4A1B0C' },
    { sym: 'COMP', name: 'Compound',   price: jitter(44.10, 0.008), base: 44.10, color: '#7F77DD', bg: '#EEEDFE', fg: '#26215C' },
  ];
  res.json({ prices, timestamp: new Date().toISOString() });
});

function jitter(v, pct = 0.015) {
  return parseFloat((v + (Math.random() - 0.5) * v * pct * 2).toFixed(4));
}

app.listen(PORT, () => {
  console.log(`DeFi Decentralization Dashboard running on port ${PORT}`);
});
