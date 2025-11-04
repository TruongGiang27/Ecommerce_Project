#!/bin/sh

# 1. Chạy Migrations
echo "Running database migrations..."
npx medusa db:migrate

# 2. Xây dựng Admin Panel (Bước Mới Cần Thiết cho Production)
echo "Building Medusa Admin Panel..."
npm run build 

# 3. Khởi động Server ở chế độ Production
echo "Starting Medusa production server..."
npm run start