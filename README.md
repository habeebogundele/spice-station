# Temmy's Spice Station

A full-stack storefront for **Temmy's Spice Station** — authentic Nigerian drinks and delicacies. Built with **Next.js (App Router)**, **MongoDB (Mongoose)**, and **Tailwind CSS v4**. Checkout completes over **WhatsApp**.

## Tech Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)          |
| UI          | React 19, Tailwind CSS v4, Motion, Lucide   |
| Database    | MongoDB via Mongoose 8                      |
| API         | Next.js Route Handlers (`src/app/api/*`)    |
| Checkout    | WhatsApp deep link (`wa.me`)                |

## Features

- Product catalogue from MongoDB, with a built-in catalogue fallback if the DB is unreachable.
- Shopping cart with variant + quantity selection.
- **Checkout creates a real order in MongoDB**, generates a tracking ID, then opens WhatsApp with a pre-filled order summary so the customer can complete payment/delivery.
- **Real order tracking** by tracking ID (`/api/orders/:trackingId`), with a status timeline.
- Hero carousel, FAQ, testimonials, and legal modals.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── products/route.ts
│       ├── products/[id]/route.ts
│       ├── orders/route.ts
│       ├── orders/[trackingId]/route.ts
│       └── seed/route.ts
├── components/
├── lib/
├── models/
├── scripts/seed.ts
├── constants.ts
└── types.ts
```

## Deploying to Vercel

Your local `.env.local` is **never** uploaded. Production must use a cloud database.

### Why the live site looked empty

[https://spice-station.vercel.app](https://spice-station.vercel.app) was loading, but `/api/products` returned **500** because `MONGODB_URI` either was missing or still pointed at `localhost` — which does not exist on Vercel servers.

### 1. Create a free MongoDB Atlas cluster

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0** cluster.
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, allow `0.0.0.0/0` (required for Vercel serverless).
5. Click **Connect → Drivers** and copy the connection string, e.g.

```
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/spice-station?retryWrites=true&w=majority
```

### 2. Add Environment Variables in Vercel

In Vercel → Project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | your Atlas connection string |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2347013323029` |
| `NEXT_PUBLIC_APP_URL` | `https://spice-station.vercel.app` |
| `SEED_SECRET` | any long random string |

Redeploy after saving (Deployments → … → Redeploy).

### 3. Seed the production catalogue (optional once)

```bash
curl -X POST https://spice-station.vercel.app/api/seed -H "Authorization: Bearer YOUR_SEED_SECRET"
```

Orders and tracking **require** a working Atlas URI. After the catalogue-fallback update is deployed, the storefront will still show products even if MongoDB is temporarily unreachable.

## Getting Started

### Prerequisites

- Node.js 20.9+
- A MongoDB database (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017/spice-station"
NEXT_PUBLIC_WHATSAPP_NUMBER="2347013323029"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SEED_SECRET="change-me-to-a-long-random-string"
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start locally

```bash
npx next -p 3000
```

Open [http://localhost:3000](http://localhost:3000).

## How Checkout Works

1. Customer adds items to the cart and fills in name, phone, and (optional) address.
2. The client POSTs the cart to `/api/orders`. The server validates items, saves the order with status `pending`, and returns a `trackingId` plus a WhatsApp URL.
3. WhatsApp opens with a message summarising the order so the customer can confirm payment and delivery.
4. The customer can later track the order by entering the tracking ID.

## Order Status & Tracking

`pending → confirmed → preparing → out_for_delivery → delivered` (or `cancelled`)

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run seed` | Seed products into MongoDB |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Type-check the project (`tsc`) |
