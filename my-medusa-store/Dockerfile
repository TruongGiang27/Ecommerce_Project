# Dockerfile cho MedusaJS chạy trên Render (build cả admin)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files và cài dependencies backend
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Cài đặt bash vì Alpine không có sẵn
RUN apk add --no-cache bash

# Build Admin
WORKDIR /app/admin
RUN npm install && npm run build

# *** BƯỚC SỬA LỖI LẦN CUỐI: Quay lại /app và di chuyển thư mục build ***
WORKDIR /app
# Thử đường dẫn Admin Build phổ biến khác: 'public'
# Di chuyển thư mục build từ /app/admin/public sang /app/admin-build
# LƯU Ý: Nếu thư mục build là 'dist', bạn phải đặt lại là 'dist'
RUN mv ./admin/public ./admin-build && rm -rf ./admin
# Nếu lỗi này vẫn xảy ra, tức là thư mục Admin build **là thư mục gốc /app/admin**

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]