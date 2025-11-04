#!/bin/bash

# Thiết lập Port cho Render. Mặc định Medusa là 9000, 
# nhưng Render cung cấp biến $PORT cho Web Service.
export PORT=9000 

echo "Running database migrations..."
npx medusa db:migrate

# Seeding chỉ được chạy khi biến môi trường SEED_DB được đặt là "true"
if [ "$SEED_DB" = "true" ]; then
    echo "Seeding database..."
    # Không dùng || echo "Seeding failed, continuing..." nữa để đảm bảo tính minh bạch
    npm run seed
else
    echo "Skipping database seeding. Set SEED_DB=true on Render to run."
fi

echo "Starting Medusa production server..."
# Khởi động server
npx medusa start