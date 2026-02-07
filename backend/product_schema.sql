-- Supabase SQL Schema for Product Context
-- Run this in your Supabase SQL Editor alongside the existing schema

-- products table for storing brand/product context
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    target_audience TEXT,
    key_features JSONB DEFAULT '[]',
    brand_voice TEXT DEFAULT 'casual',  -- casual, professional, playful
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_device_id ON products(device_id);

-- Enable Row Level Security (optional, for future auth)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
