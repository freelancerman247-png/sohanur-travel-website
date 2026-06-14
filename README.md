# RoboticAPI Recharge Software

RoboticAPI is a professional, Hostinger-friendly recharge software prototype for
a multi-recharge API provider business. It includes admin login, customer
signup/login, customer dashboard, Lapu SIM/DTH management, wallet balance, API
keys, recharge orders, and API documentation.

## Included features

- Login page with admin and customer role handling.
- Customer signup page for companies that want to use your recharge API.
- Responsive admin dashboard inspired by the provided mobile screenshot.
- Customer/client dashboard with wallet, API key, profile, and recharge orders.
- Lapu management for Airtel, Vi, BSNL, Jio, Tata Play, Dish TV, D2H, Sun
  Direct, and Airtel Digital TV routes.
- Company onboarding with callback URL, IP whitelist, and generated API key.
- Wallet-based manual recharge workflow that routes through selected Lapu
  balance.
- Recharge order table with success/pending status.
- API documentation section for partner company integrations:
  - `POST /api/v1/recharge`
  - `GET /api/v1/recharge/status`
  - callback payload format
- Demo data persistence in browser `localStorage`.

## Demo login

Admin:

```text
Email: admin@roboticapi.in
Password: admin123
```

Customer:

- Use **Customer Signup** on the login page to create a new customer account.
- Admin-created customers use demo password `client123`.

## Run locally

No package installation is required.

```bash
npm start
```

Then open:

```text
http://localhost:4173
```

You can also open `index.html` directly in a browser.

## Validate

```bash
npm test
```

## Next backend modules to connect

This repository currently contains a static, interactive product prototype that
can be uploaded to Hostinger File Manager and opened from your domain. For real
production use, connect the UI to a backend that provides:

- Secure server-side authentication and API key rotation.
- Database storage for customers, orders, wallets, and Lapu lines.
- Wallet, commission, and settlement ledgers.
- Real telecom/DTH operator gateway integrations.
- Lapu device/SIM automation, retry routing, and balance sync.
- Signed callbacks, IP allowlisting, audit logs, and reconciliation reports.