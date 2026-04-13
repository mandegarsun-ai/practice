# OpoFinance — Support Portal Dashboard

A dark-themed, frontend-only support agent dashboard built for a forex brokerage. No frameworks, no build tools — just HTML, CSS, and JavaScript.

---

## Features

- **Authentication** — Login and signup screens with localStorage-based session persistence
- **Overview Dashboard** — 4 live stat cards (Active Chats, Open Tickets, Resolved Today, Avg Response Time)
- **Live Chats Widget** — Real-time chat list with agent avatars, unread counters, and online status indicators
- **Ticket Queue** — Priority-color-coded tickets with status pills (Open / Pending / Resolved)
- **Live FX Rates** — 6 currency pairs (EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, XAU/USD) that update every 2 seconds with simulated price movement
- **KYC Verification Queue** — Pending document review items with Approve / Review actions
- **Analytics Charts** (Chart.js 4.4.1):
  - Line chart — Daily tickets resolved (Mon–Sun) with gradient fill
  - Donut chart — Ticket breakdown by category with custom legend
  - Bar chart — Avg response time per day with red dashed SLA target line
- **Toast Notifications** — Slide-in notification on login
- **Sidebar** — Glowing blue border, gradient logo text, animated nav icons, hover arrow, section dividers, gradient footer fade

---

## Project Structure

```
forex-support-dashboard/
├── index.html   # Markup — auth screens, dashboard layout, widgets, charts
├── style.css    # All styles — design tokens, components, animations, responsive
├── script.js    # All logic — auth, nav, FX rate simulation, Chart.js setup
└── README.md
```

---

## Getting Started

No installation needed. Just open the file in a browser:

```
index.html
```

Or serve locally with any static server:

```bash
npx serve .
# or
python -m http.server
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure and layout |
| CSS3 | Styling, animations, CSS custom properties |
| Vanilla JavaScript | Auth logic, FX simulation, DOM manipulation |
| [Chart.js 4.4.1](https://www.chartjs.org/) | Line, Donut, and Bar charts |

---

## Design

- **Background:** `#0a0a0a`
- **Sidebar:** `#111111` with glowing blue right border
- **Cards:** `#1a1a1a`
- **Accent:** `#2563eb` (blue)
- **Font:** Segoe UI / system-ui

---

## Live Demo

Hosted via GitHub Pages:  
**https://mandegarsun-ai.github.io/practice/**
