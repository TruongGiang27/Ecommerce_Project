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
# 1. Di chuyển thư mục build Admin từ /app/admin/dist sang /app/admin-build
# 2. Xóa thư mục source admin để giảm kích thước image (rm -rf ./admin)
# SỬ DỤNG LỆNH MV TRỰC TIẾP
RUN mv ./admin/dist ./admin-build && rm -rf ./admin 
# Lưu ý: Lệnh này giả định admin build là 'dist' và bạn muốn xóa source code Admin sau khi build.

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]