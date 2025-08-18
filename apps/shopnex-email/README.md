# Easy Email App

**Easy Email** is a lightweight email app designed to run entirely on the client side. It can be deployed separately, for example on Cloudflare Pages or any static hosting, and embedded anywhere via an `<iframe>`.

This makes it perfect for integrating into existing platforms or dashboards without requiring a backend.

> ⚠️ Note: This app cannot work with SQLite. Make sure your environment uses a supported database if needed.

---

## Features

- Runs entirely client-side — no server required
- Easy to embed in any application via `<iframe>`
- Simple setup and deployment
- Fully configurable via environment variables

---

## Getting Started

1. **Install dependencies**

```bash
pnpm --ignore-workspace install
```

2. **Configure environment variables**

Copy the example file and fill in the required values:

```bash
cp .env.example .env
```

3. **Start the development server**

```bash
pnpm dev
```

Your app will now be running locally, ready to test and embed.

---

## Deployment

Since this is a client-only app, you can deploy it to any static hosting service:

- **Cloudflare Pages**
- **Vercel**
- **Netlify**

Simply build the project and serve the generated static files:

```bash
pnpm build
```
