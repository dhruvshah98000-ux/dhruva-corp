# Dhruva Corporation — Digital Services Platform

Enterprise-grade digital services website built with React + TypeScript, Node.js, Supabase, and Razorpay.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Razorpay |
| Build | Vite |

---

## Project Structure

```
dhruva-corp/
├── frontend/          # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/   # UI + Layout components
│   │   ├── pages/        # All pages (auth, dashboard, admin, etc.)
│   │   ├── context/      # AuthContext
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API service layer
│   │   ├── lib/          # Supabase client, Axios instance
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Format helpers
├── server/            # Node.js + Express + TypeScript
│   └── src/
│       ├── routes/       # Express routes
│       ├── controllers/  # Request handlers
│       ├── middleware/   # Auth, error, validation
│       ├── validators/   # Zod schemas
│       ├── lib/          # Supabase admin, Razorpay
│       └── utils/        # Date helpers
└── supabase/
    └── migrations/    # SQL migration files
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project
- A [Razorpay](https://razorpay.com) account (test mode is fine)

---

### Step 1 — Supabase Setup

1. Create a new project at https://supabase.com
2. Go to **SQL Editor** in your Supabase dashboard
3. Open `supabase/migrations/001_initial_schema.sql`
4. Paste the entire contents into the SQL editor and run it
5. This creates all tables, RLS policies, triggers, and seed data

**Get your Supabase credentials:**
- Project URL: Settings → API → Project URL
- Anon Key: Settings → API → `anon` `public` key
- Service Role Key: Settings → API → `service_role` key (**keep this secret**)

---

### Step 2 — Razorpay Setup

1. Sign up at https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Generate a new key pair (test mode)
4. Save your **Key ID** and **Key Secret**

**Webhook setup:**
1. Go to Razorpay Dashboard → Webhooks → Add New Webhook
2. Set the URL to: `https://yourdomain.com/api/webhook/razorpay`
3. Set a **Webhook Secret** (any random string)
4. Enable events: `payment.captured`, `payment.failed`, `order.paid`

---

### Step 3 — Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

### Step 4 — Install Dependencies & Run

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Run in development:**

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev
# API runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# UI runs on http://localhost:3000
```

---

### Step 5 — Create the First Admin Account

1. Register a new account on the website
2. In your **Supabase Dashboard → SQL Editor**, run:

```sql
INSERT INTO admin_roles (user_id)
SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com';
```

3. The user now has admin access at `/admin`

---

## Where to Configure Things

| Task | Where |
|---|---|
| Add/edit products | `/admin/products` |
| Change prices | `/admin/products` → Edit Plan |
| Configure Razorpay keys | `server/.env` |
| Configure support contacts | `/admin/settings` |
| View customer payments | `/admin/orders` |
| View all purchase history | `/admin/orders` or `/admin/customers` |
| Create first admin | SQL: `INSERT INTO admin_roles` |
| Update site name/footer | `/admin/settings` |

---

## Deployment Guide

### Backend (Node.js)

```bash
cd server
npm run build
# Deploy dist/ to your server or platform (Railway, Render, EC2, etc.)
npm start
```

**Environment:** Set all `server/.env` variables as live hosting environment variables.

### Frontend (React)

```bash
cd frontend
npm run build
# Deploy dist/ to Vercel, Netlify, S3+CloudFront, etc.
```

**Environment:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables.

### Update CORS

In `server/.env`, set `CORS_ORIGIN` to your live frontend URL:
```
CORS_ORIGIN=https://yourdomain.com
```

### Update Razorpay Webhook URL

In Razorpay Dashboard, update your webhook URL to:
```
https://api.yourdomain.com/api/webhook/razorpay
```

### Switch to Razorpay Live Mode

Replace test keys with live keys:
```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=your_live_key_secret
```

---

## Security Checklist

- [x] Razorpay Key Secret never exposed to frontend
- [x] Supabase Service Role Key never exposed to frontend
- [x] Server-side Razorpay signature verification on every payment
- [x] Webhook signature verification before processing
- [x] Row Level Security enabled on all tables
- [x] Admin role checked server-side (not from frontend)
- [x] Product prices always fetched from DB (never trusted from frontend)
- [x] Purchase expiry calculated server-side
- [x] User can only access their own orders/purchases
- [x] Rate limiting on all API routes (stricter on payment routes)
- [x] Helmet.js security headers
- [x] Webhook processing is idempotent (no duplicate purchases)
- [x] Input validation with Zod on all endpoints
- [x] Error messages never expose stack traces or DB details
- [x] `.env` files in `.gitignore`

---

## Testing Checklist

### Authentication
- [ ] Sign up with email
- [ ] Email verification
- [ ] Login / Logout
- [ ] Forgot password → reset email → new password
- [ ] Protected routes redirect to /login

### Payments (use Razorpay test cards)
- [ ] Create order → Razorpay opens
- [ ] Successful payment → verified server-side → purchase created
- [ ] Failed payment → order marked failed → no purchase created
- [ ] Payment cancelled → failed page shown
- [ ] Webhook fires → order updated correctly
- [ ] Duplicate webhook → idempotent (no duplicate purchase)

**Razorpay Test Card:** 4111 1111 1111 1111 · Any future date · Any CVV

### Security
- [ ] User A cannot access User B's purchase (test with different accounts)
- [ ] Non-admin cannot access /admin
- [ ] Changing productId/planId in request body uses DB price (not the sent value)
- [ ] Expired purchase remains expired after refresh

---

## Support

- Email: support@dhruva.corp
- Admin Panel: `/admin`
