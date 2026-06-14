# Deploying roboticapi.in

This project is a Next.js SaaS application with middleware, API routes, Prisma,
and a server runtime. It is not a simple static HTML site, so the upload target
must support Node.js.

## Recommended deployment options

### Option A: Vercel/Render/Railway for the app + Hostinger for the domain

Use this if your Hostinger plan is standard shared web hosting. Shared hosting
usually works well for PHP/static files, but it does not reliably run a
production Next.js server with API routes and Prisma.

1. Push the code to GitHub.
2. Create a PostgreSQL database with Neon, Supabase, Railway, Render, or
   Hostinger VPS PostgreSQL.
3. Deploy the GitHub repo to Vercel, Render, or Railway.
4. Add these environment variables in the deployment platform:

   ```bash
   DATABASE_URL="postgresql://..."
   APP_URL="https://roboticapi.in"
   ROOT_DOMAIN="roboticapi.in"
   JWT_SECRET="generate-a-strong-32-character-secret"
   API_KEY_PEPPER="generate-a-different-32-character-secret"
   STRIPE_SECRET_KEY=""
   STRIPE_WEBHOOK_SECRET=""
   ```

5. In Hostinger hPanel, open **Domains -> DNS / Nameservers** for
   `roboticapi.in`.
6. Point the domain to the app host:
   - For Vercel:
     - `A` record: `@` -> `76.76.21.21`
     - `CNAME` record: `www` -> `cname.vercel-dns.com`
   - For Render/Railway:
     - Use the exact `A`/`CNAME` records they show in their custom domain screen.
7. Add `roboticapi.in` and `www.roboticapi.in` inside the app host custom domain
   settings.
8. Wait for DNS propagation and SSL certificate provisioning.

### Option B: Hostinger VPS or Hostinger plan with Node.js support

Use this if you specifically want the app running on Hostinger infrastructure.

1. Buy/enable a Hostinger VPS or a hosting plan that explicitly supports Node.js
   apps.
2. SSH into the server.
3. Install Node.js 22+, npm, PostgreSQL or connect to managed PostgreSQL, nginx,
   and pm2.
4. Clone the repo:

   ```bash
   git clone https://github.com/<your-org>/<your-repo>.git roboticapi
   cd roboticapi
   npm install
   cp .env.example .env
   ```

5. Edit `.env`:

   ```bash
   DATABASE_URL="postgresql://..."
   APP_URL="https://roboticapi.in"
   ROOT_DOMAIN="roboticapi.in"
   JWT_SECRET="generate-a-strong-32-character-secret"
   API_KEY_PEPPER="generate-a-different-32-character-secret"
   ```

6. Generate Prisma client and build:

   ```bash
   npm run db:generate
   npm run build
   ```

7. Start with pm2:

   ```bash
   pm2 start npm --name roboticapi -- start
   pm2 save
   pm2 startup
   ```

8. Configure nginx as a reverse proxy:

   ```nginx
   server {
     server_name roboticapi.in www.roboticapi.in;

     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

9. Point Hostinger DNS:
   - `A` record: `@` -> your VPS public IP
   - `A` record: `www` -> your VPS public IP
10. Install SSL:

    ```bash
    sudo certbot --nginx -d roboticapi.in -d www.roboticapi.in
    ```

## Where not to upload this app

Do not upload `.next`, `src`, or the project folder directly into Hostinger
`public_html` for production. That method is for static/PHP websites. This app
needs `npm install`, `npm run build`, environment variables, and a running Node.js
process.

## Static export fallback

Next.js can export static pages, but this project uses middleware, API routes,
Prisma, and tenant-aware server functionality. Static export would remove the
SaaS backend behavior, so it is not recommended for the production platform.
