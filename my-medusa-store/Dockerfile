# Dockerfile cho MedusaJS chạy trên Render (build cả admin)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files và cài dependencies backend
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code (Bao gồm cả thư mục src/admin)
COPY . .

# Cài đặt bash vì Alpine không có sẵn
RUN apk add --no-cache bash

# 1. Chuyển đến thư mục Admin thực tế
WORKDIR /app/src/admin
RUN npm install && npm run build

# 2. Quay lại thư mục backend gốc
WORKDIR /app

# *** FIX LỖI: DI CHUYỂN THƯ MỤC BUILD (THAY 'dist' bằng 'build') ***
# Di chuyển thư mục build từ /app/src/admin/build sang /app/admin-build
RUN mv ./src/admin/build ./admin-build

# 4. XÓA THƯ MỤC SOURCE ADMIN (Không cần thiết cho runtime)
RUN rm -rf ./src/admin

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]