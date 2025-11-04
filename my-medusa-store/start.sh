#!/bin/sh

# 1. Chạy Migrations
echo "Running database migrations..."
npx medusa db:migrate

# 2. Xây dựng Admin Panel (QUAN TRỌNG: Tăng bộ nhớ để tránh Out-of-Memory)
echo "Building Medusa Admin Panel..."
# Sử dụng NODE_OPTIONS để tăng bộ nhớ heap cho quá trình build (ví dụ 2048MB)
NODE_OPTIONS=--max-old-space-size=2048 npm run build

# 3. Khởi động Server ở chế độ Production
echo "Starting Medusa production server..."
npm run start