# DeFi Decentralization Intelligence Dashboard

A real-time, interactive dashboard for monitoring the **Composite Decentralization Index (CDI)** across major DeFi protocols — built as part of the research paper *"A Composite Index Framework for Quantifying Decentralization in Web3 Systems"*.

---

## Features

- **Live CDI(t) time series** — 90-day rolling chart for Uniswap v3, Aave v3, SushiSwap, Curve, Compound
- **Token price monitor** — UNI, AAVE, SUSHI, CRV, COMP with sparkline graphs (updates every 3s)
- **Protocol rankings** — dynamic table sorted by CDI score with risk classification
- **Decentralization Paradox visualizer** — operational vs governance gap per protocol
- **Radar chart** — normalized Gini / HHI / Entropy breakdown
- **Auto-refresh** — configurable 15s / 30s / 60s refresh cycle with countdown ring
- **REST API** — `/api/protocols` and `/api/prices` endpoints for integration

---

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JS + Chart.js 4
- **Hosting:** Render (Web Service)

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/protocols` | Returns CDI metrics for all 5 protocols |
| `GET /api/prices` | Returns simulated token prices |

### Example response — `/api/protocols`

```json
{
  "protocols": [
    {
      "id": "uniswap",
      "name": "Uniswap v3",
      "gini": 0.2213,
      "hhi": 2148,
      "entropy": 6.43,
      "cdi": 0.431,
      "color": "#378ADD"
    }
  ],
  "timestamp": "2024-03-15T10:22:00.000Z"
}
```

---

## CDI Formula

```
CDI = (w₁ × N(Gini)) + (w₂ × N(HHI)) + (w₃ × N(Entropy))
     where w₁ = w₂ = w₃ = 1/3
```

| CDI Range | Interpretation |
|---|---|
| 0.0 – 0.3 | Highly Centralized |
| 0.3 – 0.6 | Moderately Decentralized |
| 0.6 – 1.0 | Highly Decentralized |

---

## Project Structure

```
defi-dashboard/
├── server.js          # Express server + API routes
├── package.json
├── .gitignore
├── README.md
└── public/
    ├── index.html     # Dashboard UI
    ├── style.css      # Dark theme styles
    └── app.js         # Charts, live data, interactivity
```

---

## Authors

Amey Dogre, Anand Rawat, Ashish Kumar Singh, Anshul Atre, Anand Sen  
**Pranveer Singh Institute of Technology, Kanpur, India**

---

## License

MIT
"# Decentralised-Dashboard" 
"# Decentralised-Dashboard" 
