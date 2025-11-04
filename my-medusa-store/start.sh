#!/bin/bash

# 1. Chạy Migrations (LUÔN CẦN THIẾT)
echo "Running database migrations..."
npx medusa db:migrate

# 2. Seeding (CHỈ KHI BIẾN MÔI TRƯỜNG ĐƯỢC SET)
# Biến môi trường này (ví dụ: SEED_DB) sẽ được set thủ công trên Render CHỈ KHI CẦN.
if [ "$SEED_DB" = "true" ]; then
    echo "Seeding database..."
    npm run seed
    # Tùy chọn: Sau khi seed thành công, bạn có thể xóa biến môi trường này
    # hoặc set nó thành false trong database/cấu hình nếu Render hỗ trợ.
else
    echo "Skipping database seeding."
fi

# 3. Khởi động Server (LUÔN CẦN THIẾT)
echo "Starting Medusa production server..."
# Quan trọng: Đảm bảo server lắng nghe trên PORT được Render cung cấp (thường là $PORT)
# Cần kiểm tra lại lệnh start của bạn có sử dụng biến $PORT không.
# Nếu không, bạn cần set biến PORT cho Render, thường là 9000
npx medusa start