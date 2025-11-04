#!/bin/sh

# Run migrations and start server
echo "Running database migrations..."
npx medusa db:migrate

# === Các dòng về Seeding đã được loại bỏ hoặc comment ===
# echo "Seeding database..."
# npm run seed || echo "Seeding failed, continuing..."
# =======================================================

# 2. Khởi động Server ở chế độ Production
echo "Starting Medusa production server..."
npm run start