# DeFi Decentralization Intelligence Dashboard

A real-time, interactive dashboard for monitoring the **Composite Decentralization Index (CDI)** across major DeFi protocols — built as part of the research paper *"A Composite Index Framework for Quantifying Decentralization in Web3 Systems"*.


## ✨ Key Features

### Core Visualizations
- **Live CDI(t) Time Series** — 90-day rolling chart showing decentralization trends for all supported protocols
- **Token Price Monitor** — Real-time prices of UNI, AAVE, SUSHI, CRV, and COMP with sparkline graphs (updates every 3 seconds)
- **Protocol Rankings** — Dynamic, sortable table with current CDI scores and **risk classification** (Highly Centralized / Moderately Decentralized / Highly Decentralized)
- **Decentralization Paradox Visualizer** — Highlights the gap between **operational decentralization** and **governance decentralization** for each protocol
- **Radar Chart** — Multi-dimensional breakdown using normalized **Gini Coefficient**, **Herfindahl-Hirschman Index (HHI)**, and **Entropy** metrics
- **Auto-refresh** — configurable 15s / 30s / 60s refresh cycle with countdown ring
- **REST API** — `/api/protocols` and `/api/prices` endpoints for integration


### User Experience
- **Auto-refresh** with configurable intervals (15s / 30s / 60s) and visual countdown ring
- **Dark theme** optimized for long-term monitoring
- **Responsive design** for desktop and tablet use

### Developer-Friendly
- **REST API** endpoints:
  - `GET /api/protocols` — Returns current CDI scores and metrics
  - `GET /api/prices` — Returns latest token prices

---

## 🎯 CDI Interpretation

| CDI Range     | Interpretation          |
|---------------|-------------------------|
| 0.0 – 0.3     | Highly Centralized      |
| 0.3 – 0.6     | Moderately Decentralized|
| 0.6 – 1.0     | Highly Decentralized    |

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript + Chart.js v4
- **Styling**: Custom CSS (Dark Modern Theme)
- **Hosting**: Render (Web Service)
- **Data Updates**: Real-time polling + scheduled refreshes

---

## 📁 Project Structure

```bash
defi-dashboard/
├── server.js                 # Express server setup + API routes
├── package.json              # Dependencies and scripts
├── .gitignore
├── README.md                 # This file
└── public/
    ├── index.html            # Main dashboard UI
    ├── style.css             # Dark theme & responsive styles
    └── app.js                # All frontend logic, charts, and live updates
---

## Authors

Amey Dogre, Anand Rawat, Ashish Kumar Singh, Anshul Atre, Anand Sen  
**Pranveer Singh Institute of Technology, Kanpur, India**

---

## License

MIT
"# Decentralised-Dashboard" 
"# Decentralised-Dashboard" 
