-- ============================================================
-- DHRUVA CORPORATION – Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT,
  email            TEXT NOT NULL,
  phone            TEXT,
  discord_username TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);

-- ============================================================
-- ADMIN ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_roles_user_id ON admin_roles(user_id);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name         TEXT NOT NULL DEFAULT 'Dhruva Corporation',
  logo_url             TEXT,
  support_phone        TEXT,
  support_email        TEXT,
  discord_support_link TEXT,
  currency             TEXT NOT NULL DEFAULT 'INR',
  footer_text          TEXT,
  terms_url            TEXT,
  privacy_url          TEXT,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed one row
INSERT INTO site_settings (company_name, support_email, discord_support_link, currency, footer_text)
VALUES ('Dhruva Corporation', 'support@dhruva.corp', 'https://discord.gg/mkMhUzpqU6', 'INR', '© 2026 Dhruva Corporation. All rights reserved.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  features    TEXT[] NOT NULL DEFAULT '{}',
  category    TEXT NOT NULL DEFAULT 'Software',
  image_url   TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug   ON products(slug);
CREATE INDEX idx_products_active ON products(active);

-- ============================================================
-- PRODUCT PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_plans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  duration_days INTEGER,           -- NULL means permanent/lifetime
  price_inr     NUMERIC(10,2) NOT NULL CHECK (price_inr > 0),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_plans_product_id ON product_plans(product_id);
CREATE INDEX idx_product_plans_active     ON product_plans(active);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'cancelled', 'refunded');

CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  product_id          UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  plan_id             UUID NOT NULL REFERENCES product_plans(id) ON DELETE RESTRICT,
  razorpay_order_id   TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  amount              NUMERIC(10,2) NOT NULL,   -- in INR (not paise)
  currency            TEXT NOT NULL DEFAULT 'INR',
  status              order_status NOT NULL DEFAULT 'pending',
  customer_name       TEXT,
  customer_email      TEXT,
  customer_phone      TEXT,
  customer_discord    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at             TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id           ON orders(user_id);
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX idx_orders_status            ON orders(status);
CREATE INDEX idx_orders_created_at        ON orders(created_at DESC);

-- ============================================================
-- PURCHASES
-- ============================================================
CREATE TYPE purchase_status AS ENUM ('active', 'expired', 'permanent', 'cancelled', 'refunded');

CREATE TABLE IF NOT EXISTS purchases (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_id              UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  plan_id               UUID NOT NULL REFERENCES product_plans(id) ON DELETE RESTRICT,
  product_name_snapshot TEXT NOT NULL,
  plan_name_snapshot    TEXT NOT NULL,
  amount_paid           NUMERIC(10,2) NOT NULL,
  purchased_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  starts_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at            TIMESTAMPTZ,              -- NULL means permanent
  status                purchase_status NOT NULL DEFAULT 'active',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchases_user_id    ON purchases(user_id);
CREATE INDEX idx_purchases_order_id   ON purchases(order_id);
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_status     ON purchases(status);
CREATE INDEX idx_purchases_expires_at ON purchases(expires_at);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Service role full access to profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- Admin roles (read-only from client)
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin_roles"
  ON admin_roles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role full access to admin_roles"
  ON admin_roles FOR ALL
  USING (auth.role() = 'service_role');

-- Site settings (public read)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Service role full access to site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Products (public read for active, service role for writes)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  USING (active = true);

CREATE POLICY "Service role full access to products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Product plans (public read for active)
ALTER TABLE product_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active product plans"
  ON product_plans FOR SELECT
  USING (active = true);

CREATE POLICY "Service role full access to product_plans"
  ON product_plans FOR ALL
  USING (auth.role() = 'service_role');

-- Orders (users see own, service role sees all)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role full access to orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- Purchases (users see own, service role sees all)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role full access to purchases"
  ON purchases FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- SEED PRODUCTS — DHRUVA CORPORATION
-- ============================================================

INSERT INTO products (name, slug, description, features, category, active)
VALUES
(
  'Aimbot',
  'aimbot',
  'Precision aimbot panel for Free Fire & Free Fire MAX. Smooth, undetected, and regularly updated.',
  ARRAY[
    'Works on Free Fire, Free Fire MAX & Free Fire 86',
    'BlueStacks / MSI / Nox / LDPlayer / MEmu / SmartGaGa / GameLoop support',
    'Smooth aim settings — fully configurable',
    'Regular anti-detection updates',
    'Easy loader setup',
    'Discord support included'
  ],
  'Panel',
  true
),
(
  'Brutal / Max Aim',
  'brutal-max-aim',
  'Maximum aggression aim panel. Highest damage output with brutal precision targeting.',
  ARRAY[
    'Works on Free Fire, Free Fire MAX & Free Fire 86',
    'BlueStacks / MSI / Nox / LDPlayer / MEmu / SmartGaGa / GameLoop support',
    'Brutal & Max aim modes',
    'Optimised for close and long range',
    'Regular anti-detection updates',
    'Discord support included'
  ],
  'Panel',
  true
),
(
  'Aimkill',
  'aimkill',
  'Auto-kill aim panel with instant target lock. Built for competitive Free Fire gameplay.',
  ARRAY[
    'Works on Free Fire, Free Fire MAX & Free Fire 86',
    'BlueStacks / MSI / Nox / LDPlayer / MEmu / SmartGaGa / GameLoop support',
    'Instant kill targeting system',
    'Configurable aim speed & FOV',
    'Regular anti-detection updates',
    'Discord support included'
  ],
  'Panel',
  true
),
(
  'UID Bypass',
  'uid-bypass',
  'UID-level bypass for Free Fire. Protects your account while running panel features.',
  ARRAY[
    'Works on Free Fire, Free Fire MAX & Free Fire 86',
    'UID-level account protection bypass',
    'Emulator support included',
    'Compatible with all major emulators',
    'Regular bypass updates',
    'Discord support included'
  ],
  'Bypass',
  true
),
(
  'LIB Bypass',
  'lib-bypass',
  'Library-level bypass panel. Deep system bypass for undetected Free Fire gameplay.',
  ARRAY[
    'Works on Free Fire, Free Fire MAX & Free Fire 86',
    'Library-level bypass technology',
    'Emulator support included',
    'Compatible with all major emulators',
    'Regular bypass updates',
    'Discord support included'
  ],
  'Bypass',
  true
),
(
  'Mobile Panel',
  'mobile-panel',
  'Panel optimised for Android mobile devices. No emulator required — play directly on your phone.',
  ARRAY[
    'Works on Free Fire, Free Fire MAX & Free Fire 86',
    'Native Android mobile support',
    'No emulator required',
    'Easy APK-based setup',
    'Regular updates',
    'Discord support included'
  ],
  'Mobile',
  true
),
(
  'iOS Panel',
  'ios-panel',
  'Exclusive panel for iPhone & iPad. Premium iOS support with advanced features.',
  ARRAY[
    'Works on Free Fire & Free Fire MAX on iOS',
    'Native iPhone & iPad support',
    'No jailbreak required',
    'Premium iOS-exclusive features',
    'Regular updates',
    'Discord support included'
  ],
  'Mobile',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: Aimbot — ₹100 / ₹300 / ₹700 / ₹3,500
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'aimbot')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['1 Day',  '7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[1, 7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[100, 300, 700, 3500]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: Brutal / Max Aim — ₹200 / ₹500 / ₹1,000 / ₹5,000
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'brutal-max-aim')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['1 Day',  '7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[1, 7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[200, 500, 1000, 5000]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: Aimkill — ₹100 / ₹500 / ₹1,000 / ₹4,000
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'aimkill')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['1 Day',  '7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[1, 7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[100, 500, 1000, 4000]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: UID Bypass — ₹150 / ₹400 / ₹1,000 / ₹4,000
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'uid-bypass')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['1 Day',  '7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[1, 7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[150, 400, 1000, 4000]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: LIB Bypass — ₹150 / ₹500 / ₹1,200 / ₹5,000
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'lib-bypass')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['1 Day',  '7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[1, 7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[150, 500, 1200, 5000]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: Mobile Panel — ₹500 / ₹1,200 / ₹5,000  (no 1-day)
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'mobile-panel')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[500, 1200, 5000]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Plans: iOS Panel — ₹700 / ₹1,500 / ₹8,000  (no 1-day)
-- ──────────────────────────────────────────────────────────────
WITH p AS (SELECT id FROM products WHERE slug = 'ios-panel')
INSERT INTO product_plans (product_id, name, duration_days, price_inr, active)
SELECT p.id,
  unnest(ARRAY['7 Days', '1 Month', 'Permanent']),
  unnest(ARRAY[7, 30, NULL]::INTEGER[]),
  unnest(ARRAY[700, 1500, 8000]::NUMERIC[]),
  true
FROM p ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- Site settings — Discord support link
-- ──────────────────────────────────────────────────────────────
UPDATE site_settings
SET
  discord_support_link = 'https://discord.gg/mkMhUzpqU6',
  support_email        = 'support@dhruva.corp',
  company_name         = 'Dhruva Corporation',
  footer_text          = '© 2026 Dhruva Corporation. All rights reserved.'
WHERE id IS NOT NULL;
