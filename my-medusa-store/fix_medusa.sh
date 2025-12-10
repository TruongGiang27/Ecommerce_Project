#!/bin/bash
set -e # Dừng ngay lập tức nếu có lỗi xảy ra

echo "======================================================"
echo "🚀 BẮT ĐẦU QUÁ TRÌNH KHÔI PHỤC MEDUSA STORE (AUTO)"
echo "======================================================"

# 1. TẠO FILE SQL SẠCH (Tự động tạo file software_data.sql)
cat <<EOF > software_data.sql
BEGIN;
-- Không dùng TRUNCATE để tránh lỗi khi chưa có bảng
-- 1. Region & Currency
INSERT INTO public.currency (code, symbol, symbol_native, name) VALUES ('vnd', '₫', '₫', 'Vietnamese Dong') ON CONFLICT DO NOTHING;
INSERT INTO public.region (id, name, currency_code, tax_rate, created_at, updated_at) VALUES ('reg_vietnam', 'Việt Nam', 'vnd', 0, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET currency_code = 'vnd';

-- 2. Shipping (Digital)
INSERT INTO public.shipping_profile (id, name, type, created_at, updated_at) VALUES ('sp_digital', 'Digital Delivery', 'default', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO public.shipping_option (id, name, region_id, profile_id, provider_id, price_type, amount, is_return, created_at, updated_at) VALUES ('so_email', 'Gửi Key qua Email', 'reg_vietnam', 'sp_digital', 'manual', 'flat_rate', 0, false, NOW(), NOW());

-- 3. Khách hàng
INSERT INTO public.customer (id, email, first_name, last_name, has_account, created_at, updated_at) VALUES 
('cus_01', 'bao.customer@gmail.com', 'Quốc Bảo', 'Nguyễn Võ', true, NOW(), NOW()),
('cus_02', 'ikon0709@gmail.com', 'Long', 'Nguyen', true, NOW(), NOW());

-- 4. Sản phẩm Demo
INSERT INTO public.product (id, title, handle, status, profile_id, discountable, created_at, updated_at) VALUES 
('prod_win11', 'Windows 11 Pro', 'windows-11', 'published', 'sp_digital', true, NOW(), NOW()),
('prod_office', 'Office 2021', 'office-2021', 'published', 'sp_digital', true, NOW(), NOW()),
('prod_gpt', 'ChatGPT Plus', 'chatgpt', 'published', 'sp_digital', true, NOW(), NOW());

-- 5. Variants & Price
INSERT INTO public.product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, created_at, updated_at) VALUES
('var_win11', 'Default', 'prod_win11', 'WIN11', 100, true, NOW(), NOW()),
('var_office', 'Default', 'prod_office', 'OFF21', 50, true, NOW(), NOW()),
('var_gpt', '1 Tháng', 'prod_gpt', 'GPT', 200, true, NOW(), NOW());

INSERT INTO public.money_amount (id, currency_code, amount, variant_id, region_id, created_at, updated_at) VALUES
('ma_win11', 'vnd', 250000, 'var_win11', 'reg_vietnam', NOW(), NOW()),
('ma_office', 'vnd', 450000, 'var_office', 'reg_vietnam', NOW(), NOW()),
('ma_gpt', 'vnd', 99000, 'var_gpt', 'reg_vietnam', NOW(), NOW());
COMMIT;
EOF

echo "✅ Đã tạo file data mẫu: software_data.sql"

# 2. RESET DB
echo "🛑 Đang reset lại database medusa_store..."
docker compose down -v
docker compose up -d postgres

echo "⏳ Đang chờ Database khởi động (5s)..."
sleep 5

echo "♻️  Tạo database medusa_store..."
docker exec medusa_postgres_ecommerce psql -U postgres -c "DROP DATABASE IF EXISTS medusa_store;"
docker exec medusa_postgres_ecommerce psql -U postgres -c "CREATE DATABASE medusa_store;"

# 3. MIGRATION
echo "🏗  Đang chạy Migration (Tạo bảng)..."
# Ép buộc kết nối vào medusa_store
docker compose run --rm -e DATABASE_URL=postgres://postgres:postgres@postgres:5432/medusa_store medusa npx medusa db:migrate

# 4. IMPORT DATA
echo "📥 Đang nạp dữ liệu..."
docker exec -i medusa_postgres_ecommerce psql -U postgres -d medusa_store < software_data.sql

# 5. ADMIN & START
echo "👤 Tạo Admin User..."
docker compose run --rm -e DATABASE_URL=postgres://postgres:postgres@postgres:5432/medusa_store medusa npx medusa user:invite --email admin@medusa-test.com --password supersecret

echo "🚀 Khởi động server..."
npm run docker:up

echo "✅ HOÀN TẤT! Truy cập: http://localhost:9000/app"
