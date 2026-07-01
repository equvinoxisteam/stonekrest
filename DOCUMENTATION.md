# Stonekrest — Product Documentation

## Overview

**Stonekrest** is the business banking software platform. **Equvinoxis India Pvt. Ltd.** is the demo client using the platform in this deployment.

| Role | Name |
|------|------|
| Software / Platform | Stonekrest |
| Demo client company | Equvinoxis India Pvt. Ltd. |
| Demo user | Aniketh (Administrator) |

## Features

- **Home** — Balances, black metal business card, cash-flow chart, recent transactions
- **Accounts** — Current account, treasury, financing
- **Payments** — UPI, NEFT, RTGS, Razorpay/Paytm gateways, international SWIFT/FIRC
- **Cards** — Debit and credit card management
- **Invoicing** — Invoices, customers, catalog

## Payment Gateways page

- Dark-themed dashboard (no white onboarding wizard)
- **Generate API Key** — opens test Razorpay keys modal
- **Test Checkout** — simulates Razorpay UPI/card/netbanking flow
- Stats: collected amount, refunds, disputes, success rate
- Recent payments and gateway settlement tables

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000

## Deploy on Railway

1. Push to GitHub: `equvinoxisteam/stonekrest`
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select the repo — Railway runs `npm start` via `railway.toml`
4. **Settings → Networking → Generate Domain**

Health check: `GET /health`

## Stack

- `mec.html` — main UI
- `styles.css` — dark theme
- `app.js` — navigation, mock data, charts
- `server.js` — Express static server

## Branding notes

- Header shows **Stonekrest** (left) and **Stonekrest · Demo** badge (right)
- Org selector shows **Equvinoxis India Pvt. Ltd.**
- UPI VPA demo: `equvinoxis@icici`
