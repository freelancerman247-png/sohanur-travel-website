# Robotic API Fintech Website and Software

This repository contains a complete frontend and PHP backend package for a fintech company website on `roboticapi.in`.

## What is included

- Public fintech landing website
- Admin software service page and protected lead dashboard
- Multi recharge software demo panel
- White-label fintech software page and quote builder
- PHP backend APIs for:
  - service catalog
  - lead capture
  - white-label quote capture
  - recharge demo submission
  - health check
- Hostinger hPanel friendly `.htaccess` rules
- Protected JSON storage in the `data/` directory

## Folder structure

```text
.
├── index.html                 # Main website
├── admin/index.html           # Protected admin lead dashboard
├── recharge/index.html        # Multi recharge demo software
├── whitelabel/index.html      # White-label quote builder
├── assets/css/styles.css      # Website and dashboard styles
├── assets/js/app.js           # Frontend API and form logic
├── api/                       # PHP backend endpoints
├── data/.htaccess             # Blocks direct access to stored leads
└── .htaccess                  # Apache/Hostinger rules
```

## Local testing

You need PHP 8 or newer.

```bash
php -S localhost:8080
```

Open:

- Website: `http://localhost:8080`
- Recharge demo: `http://localhost:8080/recharge/`
- White-label page: `http://localhost:8080/whitelabel/`
- Admin panel: `http://localhost:8080/admin/`
- API health check: `http://localhost:8080/api/health.php`

## Admin token

The admin dashboard reads leads from `api/leads.php`.

Before uploading, edit:

```php
api/config.php
```

Change:

```php
const ROBOTIC_API_DEFAULT_ADMIN_TOKEN = 'change-this-admin-token';
```

Use a long private value, for example:

```php
const ROBOTIC_API_DEFAULT_ADMIN_TOKEN = 'my-very-private-admin-token-2026';
```

After upload, open `https://roboticapi.in/admin/`, enter that token, and click **Load Leads**.

## Upload guide for Hostinger hPanel under roboticapi.in

1. Sign in to Hostinger hPanel.
2. Go to **Websites** and select the hosting plan for `roboticapi.in`.
3. Open **Files** > **File Manager**.
4. Open the domain root folder, usually:
   - `public_html/` for the main domain, or
   - `domains/roboticapi.in/public_html/` for an addon domain.
5. Delete old placeholder files only if you no longer need them.
6. Upload these project files and folders into `public_html/`:
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `api/`
   - `admin/`
   - `recharge/`
   - `whitelabel/`
   - `data/`
7. In hPanel, confirm PHP version is PHP 8.0 or newer:
   - **Advanced** > **PHP Configuration**
8. Set permissions:
   - folders: `755`
   - files: `644`
   - `data/` folder must be writable by PHP. If leads do not save, set `data/` to `755` or `775`.
9. Visit `https://roboticapi.in/api/health.php`.
   - `ok` should be `true`.
   - `storageWritable` should be `true`.
10. Visit `https://roboticapi.in/` and submit the contact form.
11. Visit `https://roboticapi.in/admin/`, enter your admin token, and load leads.

## Important production notes

- This package stores leads in `data/leads.json`. This is simple and Hostinger shared-hosting friendly.
- For a high-volume production fintech platform, upgrade storage to MySQL.
- The recharge panel is a safe demo workflow. Connect real operator APIs, callback verification, wallet ledger, and transaction signing before processing live money movement.
- Keep your admin token private.
- Do not expose API provider credentials in frontend JavaScript.

## Customization checklist

- Replace logo mark and brand colors in `assets/css/styles.css`.
- Update phone, WhatsApp, address, and legal information in `index.html`.
- Update services and packages in `api/catalog.php`.
- Change admin token in `api/config.php`.
- Add privacy policy, refund policy, and terms pages before accepting production customers.