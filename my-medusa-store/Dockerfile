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
# 1. DI CHUYỂN THƯ MỤC BUILD (KHẢ NĂNG LÀ 'dist')
# Nếu lỗi này xảy ra lần nữa, bạn cần kiểm tra trực tiếp code để biết tên thư mục build.
RUN mv ./admin/dist ./admin-build

# 2. XÓA THƯ MỤC SOURCE ADMIN
# Bước này là tùy chọn, nhưng giúp giảm kích thước Docker Image
RUN rm -rf ./admin 

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]