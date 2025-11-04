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

# *** FIX LỖI 1: CHUYỂN ĐẾN THƯ MỤC ADMIN THỰC TẾ ***
WORKDIR /app/src/admin
RUN npm install && npm run build

# 2. Quay lại thư mục backend gốc
WORKDIR /app

# *** FIX LỖI 2: DI CHUYỂN THƯ MỤC BUILD ĐÚNG ĐƯỜNG DẪN ***
# Di chuyển thư mục build từ /app/src/admin/dist sang /app/admin-build
# LƯU Ý: Phải sử dụng đường dẫn tương đối từ /app
RUN mv ./src/admin/dist ./admin-build

# 4. XÓA THƯ MỤC SOURCE ADMIN (Không cần thiết cho runtime)
RUN rm -rf ./src/admin

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]