# Pavoire — Production-Ready Luxury Jewellery E-commerce

Pavoire is a full-stack jewellery e-commerce platform with a premium feminine glassmorphism UI, OTP-only email authentication (via Resend), Razorpay checkout gated by OTP verification, PostgreSQL persistence, admin order management, invoice generation, QR order tagging, and deployment-ready documentation.

## Monorepo Structure

```bash
Pavoirewebsite/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── sql/
│   │   └── schema.sql
│   └── src/
│       ├── config/env.js
│       ├── db/
│       │   ├── pool.js
│       │   ├── run-migrations.js
│       │   └── seed.js
│       ├── middleware/auth.middleware.js
│       ├── routes/
│       │   ├── admin.routes.js
│       │   ├── auth.routes.js
│       │   ├── cart.routes.js
│       │   ├── config.routes.js
│       │   ├── orders.routes.js
│       │   ├── products.routes.js
│       │   └── wishlist.routes.js
│       ├── services/
│       │   ├── email.service.js
│       │   ├── invoice.service.js
│       │   └── payment.service.js
│       ├── utils/
│       │   ├── auth.js
│       │   ├── crypto.js
│       │   └── otp.js
│       └── server.js
├── frontend/
│   ├── package.json
│   ├── .env.example
│   ├── app/
│   │   ├── admin/page.jsx
│   │   ├── cart/page.jsx
│   │   ├── product/[id]/page.jsx
│   │   ├── wishlist/page.jsx
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── CheckoutModal.jsx
│   │   ├── Navbar.jsx
│   │   └── ProductCard.jsx
│   ├── lib/api.js
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   └── tailwind.config.js
└── package.json
```

## Core Features Delivered

### Luxury UI / UX
- Blush-pink and rose-gold brand palette with premium typography (`Playfair Display`, `Inter`, `Poppins`).
- Glassmorphism cards/modals (blur, transparency, soft borders, shadows).
- Pink ombré glass buttons with smooth hover micro-interactions.
- Responsive mobile + desktop layouts.

### Frontend
- Homepage with category tabs: `Vintage`, `Trending`, `New Arrivals`, `Earrings`, `Rings`, `Neckpieces`, `Anklets`.
- Search and category filtering.
- Product cards with image, price, wishlist CTA.
- Product detail page with rich product view and Add to Cart / Wishlist.
- Cart page + Checkout modal.
- Wishlist page.
- Admin dashboard page.

### Strict Checkout Flow Implemented
1. Add products to cart.
2. Click checkout.
3. Popup asks for email.
4. Backend sends OTP to email using Resend.
5. User verifies OTP.
6. Pay Now button appears only after OTP verification.
7. Razorpay order opens (or mock-mode fallback if keys missing).
8. Payment verified by backend; order marked `PAID`.

### Authentication
- Email OTP only (no mobile OTP).
- Secure JWT session issued after OTP verification.

### Backend + Database
- Node.js + Express backend.
- PostgreSQL schema for:
  - `users`
  - `products`
  - `cart`
  - `wishlist`
  - `orders`
  - `order_items`
- OTP handling, cart/wishlist APIs, order/payment APIs, admin APIs.

### Payment & Post-Payment Automation
- Razorpay order creation and signature verification.
- On successful payment:
  - Order status updated to `PAID`
  - Invoice HTML generated
  - Customer email sent with receipt + QR code
  - Admin email sent with payment details
  - QR code saved in `orders.qr_code`
  - Cart cleared

## API Overview

- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/products`
- `GET /api/products/:id`
- `GET|POST|PATCH|DELETE /api/cart`
- `GET|POST|DELETE /api/wishlist`
- `POST /api/orders/checkout/create-order`
- `POST /api/orders/checkout/verify-payment`
- `GET /api/orders/my-orders`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `GET /api/config/public`

## Local Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3) Fill your private keys/secrets manually in `backend/.env`
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=
JWT_SECRET=
OTP_EXPIRY_MINUTES=10
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GOOGLE_PLACES_API_KEY=
```

### 4) Run migrations and seed
```bash
npm run db:migrate --workspace backend
npm run db:seed --workspace backend
```

### 5) Start full stack
```bash
npm run dev
```

## Deploy
- Frontend on Vercel/Netlify (`frontend/` root)
- Backend on Render/Railway (`backend/` root)
- Attach PostgreSQL and set env vars in provider dashboard

## What you need to fill by yourself (important)
These values are intentionally left blank for your privacy/security:
1. `DATABASE_URL` (your PostgreSQL connection string)
2. `JWT_SECRET` (long random secret)
3. `RESEND_API_KEY` (from your Resend account)
4. `RESEND_FROM_EMAIL` (verified sender domain/email in Resend)
5. `ADMIN_EMAIL` (your admin inbox)
6. `RAZORPAY_KEY_ID` (from your Razorpay dashboard)
7. `RAZORPAY_KEY_SECRET` (from your Razorpay dashboard)
8. `GOOGLE_PLACES_API_KEY` (Google Cloud Places API key)

After filling these, your OTP + payment flow will run with your own accounts.
