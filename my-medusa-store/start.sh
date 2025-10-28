#!/bin/sh

# Thoát ngay lập tức nếu bất kỳ lệnh nào thất bại
set -e

echo "Starting Medusa Production Server..."

# 1. Chạy Migrations
# Sử dụng 'npm run migrate' (được định nghĩa là medusa migrations run trong package.json)
npm run migrate

# 2. Khởi động Server ở chế độ Production
# Sử dụng 'npm run start' (được định nghĩa là medusa start trong package.json)
npm run start
