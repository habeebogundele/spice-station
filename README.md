# Temmy's Spice Station

A full-stack storefront for **Temmy's Spice Station** — authentic Nigerian drinks and delicacies. Built with **Next.js (App Router)**, **MongoDB (Mongoose)**, and **Tailwind CSS v4**. Checkout completes over **WhatsApp**.

## Tech Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)          |
| UI          | React 19, Tailwind CSS v4, Motion, Lucide   |
| Database    | MongoDB via Mongoose 8                       |
| API         | Next.js Route Handlers (`src/app/api/*`)    |
| Checkout    | WhatsApp deep link (`wa.me`)                |

## Features

- Product catalogue served from MongoDB (`/api/products`).
- Shopping cart with variant + quantity selection.
- **Checkout creates a real order in MongoDB**, generates a tracking ID, then opens
  WhatsApp with a pre-filled order summary so the customer can complete payment/delivery.
- **Real order tracking** by tracking ID (`/api/orders/:trackingId`), with a status timeline.
- Hero carousel, FAQ, testimonials, and legal modals.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout + metadata
│   ├── page.tsx              # Home page (server) — loads products from DB
│   ├── globals.css           # Tailwind v4 + brand theme
│   └── api/
│       ├── products/route.ts            # GET all products
│       ├── products/[id]/route.ts       # GET one product (by slug)
│       ├── orders/route.ts              # POST create order
│       └── orders/[trackingId]/route.ts # GET order tracking
├── components/               # UI (Navbar, Hero, ProductCard, CartSidebar, ...)
│   └── HomeClient.tsx        # Client shell that owns cart state
├── lib/
│   ├── mongodb.ts            # Cached Mongoose connection
│   ├── products.ts           # Product data-access (serialized for the UI)
│   ├── orders.ts             # Order creation + tracking logic
│   ├── whatsapp.ts           # WhatsApp message + wa.me URL builder
│   └── utils.ts              # cn() class helper
├── models/                   # Mongoose schemas (Product, Order)
├── scripts/seed.ts           # Seeds the product catalogue into MongoDB
├── constants.ts              # Seed data + static FAQ/testimonials
└── types.ts                  # Shared TypeScript types
```

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
# .env.local
MONGODB_URI="mongodb://127.0.0.1:27017/spice-station"
NEXT_PUBLIC_WHATSAPP_NUMBER="2347013323029"   # international format, digits only
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> `NEXT_PUBLIC_WHATSAPP_NUMBER` is the business number that receives checkout orders.

### 3. Seed the database

```bash
npm run seed
```

This loads the four products (Tigernut Drink, Zobo Drink, Dried Ponmo, Smoked Catfish) into MongoDB.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How Checkout Works

1. Customer adds items to the cart and fills in name, phone, and (optional) address.
2. The client POSTs the cart to `/api/orders`. The server validates items against the DB,
   computes the total, saves the order with status `pending`, and returns a `trackingId`
   plus a pre-built WhatsApp URL.
3. WhatsApp opens with a message summarising the order so the customer can confirm payment
   and delivery with the business.
4. The customer can later track the order by entering the tracking ID in the **Track Your Order** section.

## Order Status & Tracking

Orders progress through these statuses (update them directly in MongoDB or via your own admin tooling):

`pending → confirmed → preparing → out_for_delivery → delivered` (or `cancelled`)

The tracking endpoint maps the current status onto a 4-step delivery timeline.

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the dev server (port 3000)     |
| `npm run build`  | Production build                     |
| `npm run start`  | Run the production build             |
| `npm run seed`   | Seed products into MongoDB           |
| `npm run lint`   | Type-check the project (`tsc`)       |
```
