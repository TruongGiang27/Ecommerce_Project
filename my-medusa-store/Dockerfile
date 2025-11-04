# Dockerfile cho MedusaJS chạy trên Render (build cả admin)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files và cài dependencies backend
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code (Đảm bảo file admin nằm trong /app/admin)
COPY . .

# Cài đặt bash vì Alpine không có sẵn
RUN apk add --no-cache bash

# Build Admin
WORKDIR /app/admin
RUN npm install && npm run build

# *** BƯỚC THÊM VÀO: Copy Admin Build files về thư mục chính ***
# Giả sử admin build tạo ra thư mục 'build' hoặc 'dist' (Kiểm tra lại tên thư mục này)
# Nếu build folder là 'build':
# COPY ./build /app/build 
# Hoặc nếu bạn muốn đặt nó trong thư mục cụ thể để Medusa dễ tìm:
WORKDIR /app
# Thay thế 'build' bằng tên thư mục build thực tế (thường là build hoặc dist)
RUN rm -rf ./admin && mv ./admin/build ./admin-build

# Medusa v2 có thể cần bạn chạy 'medusa build' cho cả backend
# Nếu bạn dùng Medusa v2 (Modular), bước này thường không cần vì npm run build trong admin đã tự build backend
# WORKDIR /app 

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]