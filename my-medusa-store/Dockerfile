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

# Nếu có thư mục admin thì build luôn
WORKDIR /app/admin
RUN npm install && npm run build

# Quay lại thư mục backend
WORKDIR /app

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy start.sh
CMD ["bash", "./start.sh"]
