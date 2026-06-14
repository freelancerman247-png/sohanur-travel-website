# RechargeHub API Platform

RechargeHub is a first-version web dashboard for a multi-recharge API provider
business. It is designed for an owner who wants to sell recharge APIs to other
companies while managing Airtel, Vi, BSNL, and DTH Lapu routes from one panel.

## Included features

- Responsive admin dashboard inspired by the provided mobile screenshot.
- Lapu management for Airtel, Vi, BSNL, Jio, Tata Play, Dish TV, D2H, Sun
  Direct, and Airtel Digital TV routes.
- Company onboarding with callback URL, IP whitelist, and generated API key.
- Manual recharge order workflow that routes through selected Lapu balance.
- Recharge order table with success/pending status.
- API documentation section for partner company integrations:
  - `POST /api/v1/recharge`
  - `GET /api/v1/recharge/status`
  - callback payload format
- Demo data persistence in browser `localStorage`.

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

This repository currently contains a static, interactive product prototype. For
production, connect the UI to a backend that provides:

- Secure company authentication and API key rotation.
- Wallet, commission, and settlement ledgers.
- Real telecom/DTH operator gateway integrations.
- Lapu device/SIM automation, retry routing, and balance sync.
- Signed callbacks, IP allowlisting, audit logs, and reconciliation reports.