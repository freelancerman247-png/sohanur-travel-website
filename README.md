# Sohanur Travel Website

A responsive static travel agency website for Sohanur Travel. It includes a polished landing page, destinations, tour packages, booking form interactions, customer reviews, FAQ content, and mobile navigation.

## Features

- Responsive hero, destination, package, about, review, booking, FAQ, contact, and footer sections
- Dedicated `contact.html` page with unique travel desk layout and contact form
- Mobile-friendly navigation menu
- Package buttons that prefill the booking flow
- Client-side booking form confirmation
- PHP admin dashboard for customer service queries
- PHP blog system with admin-managed posts
- No build step or external JavaScript dependencies

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project files

- `index.html` - page markup and content
- `contact.html` - dedicated contact page
- `styles.css` - responsive layout and visual design
- `script.js` - menu, package selection, sticky header, and form behavior
- `submit-query.php` - saves customer queries from website forms
- `thank-you.php` - customer confirmation page after query submission
- `admin/` - admin login and query dashboard
- `blog.php` - public blog listing page
- `blog-post.php` - public blog detail page
- `data/` - protected JSON query storage
- `query-form-example.html` - copy/paste form snippet for service pages

## Hostinger admin dashboard setup

Upload these folders/files into `public_html`:

```text
admin/
data/
submit-query.php
thank-you.php
query-form-example.html
blog.php
blog-post.php
```

Then open:

```text
https://your-domain.com/admin/login.php
```

Default login:

```text
Username: admin
Password: Admin@12345
```

Change the password after upload by editing `admin/config.php`. Replace `ADMIN_PASSWORD_HASH` with the SHA-256 hash of your new password.

To collect queries from any service page, add a form that posts to:

```html
<form action="submit-query.php" method="post">
```

You can copy the complete example from `query-form-example.html`.

## Blog setup

Upload:

```text
blog.php
blog-post.php
admin/blog.php
data/blog-posts.json
```

Manage posts here:

```text
https://your-domain.com/admin/blog.php
```

Public blog page:

```text
https://your-domain.com/blog.php
```

To add a header menu link, add:

```html
<li><a href="blog.php">Blog</a></li>
```