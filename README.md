# Robotic API - Lapu SIM Recharge Automation Website

This repository contains the first development step for **roboticapi.in**: a
multi-page static website for a Lapu SIM Recharge Automation software business.

## Website pages

- `index.html` - Home page and product overview
- `features.html` - Planned software modules and development phases
- `pricing.html` - Sample package/pricing layout
- `guide.html` - Hostinger hPanel upload guide
- `contact.html` - Inquiry form front-end
- `assets/css/styles.css` - Website design and responsive layout
- `assets/js/main.js` - Mobile menu and contact form validation

## Future backend starter

- `backend/cpp/recharge_gateway_stub.cpp` - Safe C++ placeholder for a future
  recharge gateway service

Do **not** upload `backend/` to Hostinger `public_html` for this first website
step. The C++ gateway normally runs on a VPS, local machine, or dedicated server.

## How to upload to Hostinger hPanel under roboticapi.in

1. Download or ZIP these website files:
   - `index.html`
   - `features.html`
   - `pricing.html`
   - `guide.html`
   - `contact.html`
   - `assets/`
2. Login to Hostinger hPanel.
3. Open **Websites** and choose **roboticapi.in**.
4. Open **File Manager**.
5. Open the **public_html** folder.
6. Upload the files listed above.
7. If you uploaded a ZIP file, extract it inside `public_html`.
8. Confirm `index.html` is directly inside `public_html`, not inside an extra
   nested folder.
9. Visit `https://roboticapi.in`.

## Next suggested development prompt

Use this prompt for the next step:

> Design the database and admin dashboard pages for Lapu SIM Recharge Automation
> with users, wallets, operators, recharge orders, commission setup, transaction
> status, and reports.