# Equvinoxis — India Business Banking Demo

Dark-themed banking dashboard for Indian businesses: UPI, NEFT, RTGS, Razorpay, Paytm, international SWIFT/FIRC, and more.

## Run locally

```bash
npm install
npm start
```

Open **http://localhost:3000**

## Deploy on Railway (recommended)

1. Push this repo to GitHub (see below).
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**.
3. Select `equvinoxisteam/stonekrest`.
4. Railway detects Node.js and runs `npm start` automatically (`railway.toml` included).
5. Open the generated URL — the app serves `mec.html` at `/`.

Health check: `GET /health`

## Push to GitHub

```bash
git init
git add .
git commit -m "Equvinoxis India banking dashboard"
git branch -M main
git remote add origin https://github.com/equvinoxisteam/stonekrest.git
git push -u origin main
```

## Navigation

| Sidebar | Pages |
|---------|--------|
| **Home** | Dashboard, balances, card, transactions |
| **Accounts** | Current Account, Treasury, Financing |
| **Transactions** | Ledger, Insights, Accounting |
| **Cards** | Debit Cards, Credit Card |
| **Payments** | Send, Gateways, UPI, International, Bill Pay, Recipients, Taxes |
| **Invoicing** | Invoices, Recurring, Customers, Catalog |

On mobile, tap **☰** to open the sidebar. Dropdown sections expand on tap and load the first page in that section.

## Stack

- Static HTML/CSS + `app.js`
- Express static server (`server.js`)
- Chart.js, Lucide icons
