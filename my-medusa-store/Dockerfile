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

# *** BƯỚC SỬA LỖI: Copy Admin Build files về thư mục chính ***
WORKDIR /app
# Đã xác nhận thư mục build là 'dist' (chứ không phải 'build')
# Lệnh này sẽ move thư mục /app/admin/dist thành /app/admin-build
# (Nếu bạn chỉ cần giữ lại /admin-build, dùng lệnh này. Nếu muốn giữ code admin, dùng COPY)
# Để đơn giản và giải quyết lỗi, chúng ta sẽ **COPY** thay vì mv/rm để tránh xung đột
COPY --from=0 /app/admin/dist /app/admin-build 
RUN rm -rf ./admin # Xóa thư mục source admin để giảm kích thước image

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]