-- MEDUSA V2 ULTRA SAFE SEED
-- Chien thuoc: Chi Insert cac cot co ban nhat (ID, Title, Handle) de tranh loi schema
-- Tuong thich moi phien ban Medusa v2

BEGIN;

-- 1. CLEAN UP (Xoa data cu)
TRUNCATE TABLE public.cart CASCADE;
TRUNCATE TABLE public.order_line_item CASCADE;
TRUNCATE TABLE public.order CASCADE;
TRUNCATE TABLE public.price CASCADE;
TRUNCATE TABLE public.price_set CASCADE;
TRUNCATE TABLE public.product_variant_price_set CASCADE;
TRUNCATE TABLE public.product_variant_option CASCADE;
TRUNCATE TABLE public.product_option_value CASCADE;
TRUNCATE TABLE public.product_option CASCADE;
TRUNCATE TABLE public.product_variant CASCADE;
TRUNCATE TABLE public.product_sales_channel CASCADE;
TRUNCATE TABLE public.product CASCADE;

-- 2. CORE SETUP

-- 2.1. Sales Channel
INSERT INTO public.sales_channel (id, name, description, is_disabled, created_at, updated_at)
SELECT 'sc_main', 'Web Key Software', 'Kenh ban hang chinh', false, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.sales_channel WHERE id = 'sc_main');

-- 2.2. Region
INSERT INTO public.region (id, name, currency_code, automatic_taxes, created_at, updated_at)
SELECT 'reg_vn', 'Viet Nam', 'vnd', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.region WHERE id = 'reg_vn');

-- 2.3. Update Store
UPDATE public.store
SET default_sales_channel_id = 'sc_main',
    default_region_id = 'reg_vn'
WHERE id IS NOT NULL;

-- 2.4. Store Currency (Fix ID null)
INSERT INTO public.store_currency (id, store_id, currency_code, is_default, created_at, updated_at)
SELECT 
    'stcur_' || id || '_vnd', 
    id, 
    'vnd', 
    true,
    NOW(),
    NOW()
FROM public.store s
WHERE NOT EXISTS (
    SELECT 1 FROM public.store_currency sc WHERE sc.store_id = s.id AND sc.currency_code = 'vnd'
);

-- 2.5. Shipping Profile (Tao san de dung sau nay)
INSERT INTO public.shipping_profile (id, name, type, created_at, updated_at)
SELECT 'sp_digital', 'Digital Delivery', 'default', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.shipping_profile WHERE id = 'sp_digital');


-- 3. PRODUCTS (Du lieu phan mem)
-- QUAN TRONG: Da bo cot 'shipping_profile_id' de tranh loi "column does not exist"

-- --- SP 1: WINDOWS 11 PRO ---
INSERT INTO public.product (id, title, handle, subtitle, description, is_giftcard, status, discountable, thumbnail, created_at, updated_at)
VALUES 
('prod_win11', 'Windows 11 Pro', 'windows-11-pro', 'Key Ban Quyen', 'Key kich hoat online vinh vien.', false, 'published', true, '', NOW(), NOW());

INSERT INTO public.product_sales_channel (id, product_id, sales_channel_id) VALUES ('psc_win11', 'prod_win11', 'sc_main');

INSERT INTO public.product_option (id, title, product_id, created_at, updated_at) VALUES ('opt_win11_ver', 'Phien ban', 'prod_win11', NOW(), NOW());
INSERT INTO public.product_option_value (id, value, option_id, created_at, updated_at) VALUES ('val_win11_retail', 'Retail', 'opt_win11_ver', NOW(), NOW());

-- Variant (Bo Inventory quantity, Bo allow_backorder neu khong can thiet)
INSERT INTO public.product_variant (id, title, sku, product_id, variant_rank, created_at, updated_at)
VALUES ('var_win11', 'Retail Key', 'WIN11-KEY', 'prod_win11', 0, NOW(), NOW());

INSERT INTO public.product_variant_option (variant_id, option_value_id) VALUES ('var_win11', 'val_win11_retail');

-- Price
INSERT INTO public.price_set (id, created_at, updated_at) VALUES ('pset_win11', NOW(), NOW());
INSERT INTO public.product_variant_price_set (id, variant_id, price_set_id) VALUES ('pvps_win11', 'var_win11', 'pset_win11');
INSERT INTO public.price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
VALUES ('price_win11', 'pset_win11', 'vnd', 250000, '{"value": "250000", "precision": 20}', 0, NOW(), NOW());


-- --- SP 2: OFFICE 365 ---
INSERT INTO public.product (id, title, handle, subtitle, description, is_giftcard, status, discountable, thumbnail, created_at, updated_at)
VALUES 
('prod_off365', 'Office 365 Pro', 'office-365', 'Tai khoan 5 thiet bi', 'Tai khoan Office 365 ban quyen.', false, 'published', true, '', NOW(), NOW());

INSERT INTO public.product_sales_channel (id, product_id, sales_channel_id) VALUES ('psc_off365', 'prod_off365', 'sc_main');

INSERT INTO public.product_option (id, title, product_id, created_at, updated_at) VALUES ('opt_off365_dur', 'Thoi han', 'prod_off365', NOW(), NOW());
INSERT INTO public.product_option_value (id, value, option_id, created_at, updated_at) VALUES ('val_off365_1y', '1 Nam', 'opt_off365_dur', NOW(), NOW());

INSERT INTO public.product_variant (id, title, sku, product_id, variant_rank, created_at, updated_at)
VALUES ('var_off365', '1 Nam', 'OFF365-1Y', 'prod_off365', 0, NOW(), NOW());

INSERT INTO public.product_variant_option (variant_id, option_value_id) VALUES ('var_off365', 'val_off365_1y');

-- Price
INSERT INTO public.price_set (id, created_at, updated_at) VALUES ('pset_off365', NOW(), NOW());
INSERT INTO public.product_variant_price_set (id, variant_id, price_set_id) VALUES ('pvps_off365', 'var_off365', 'pset_off365');
INSERT INTO public.price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
VALUES ('price_off365', 'pset_off365', 'vnd', 150000, '{"value": "150000", "precision": 20}', 0, NOW(), NOW());


-- --- SP 3: YOUTUBE PREMIUM ---
INSERT INTO public.product (id, title, handle, subtitle, description, is_giftcard, status, discountable, thumbnail, created_at, updated_at)
VALUES 
('prod_ytb', 'Youtube Premium', 'youtube-premium', 'Nang cap chinh chu', 'Nang cap Youtube Premium khong quang cao.', false, 'published', true, '', NOW(), NOW());

INSERT INTO public.product_sales_channel (id, product_id, sales_channel_id) VALUES ('psc_ytb', 'prod_ytb', 'sc_main');

INSERT INTO public.product_option (id, title, product_id, created_at, updated_at) VALUES ('opt_ytb_dur', 'Goi', 'prod_ytb', NOW(), NOW());
INSERT INTO public.product_option_value (id, value, option_id, created_at, updated_at) VALUES ('val_ytb_6m', '6 Thang', 'opt_ytb_dur', NOW(), NOW());

INSERT INTO public.product_variant (id, title, sku, product_id, variant_rank, created_at, updated_at)
VALUES ('var_ytb', '6 Thang', 'YTB-6M', 'prod_ytb', 0, NOW(), NOW());

INSERT INTO public.product_variant_option (variant_id, option_value_id) VALUES ('var_ytb', 'val_ytb_6m');

-- Price
INSERT INTO public.price_set (id, created_at, updated_at) VALUES ('pset_ytb', NOW(), NOW());
INSERT INTO public.product_variant_price_set (id, variant_id, price_set_id) VALUES ('pvps_ytb', 'var_ytb', 'pset_ytb');
INSERT INTO public.price (id, price_set_id, currency_code, amount, raw_amount, rules_count, created_at, updated_at)
VALUES ('price_ytb', 'pset_ytb', 'vnd', 270000, '{"value": "270000", "precision": 20}', 0, NOW(), NOW());

COMMIT;