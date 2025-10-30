# Dockerfile cho MedusaJS chạy trên Render
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files và cài dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Thêm bash vì Alpine không có sẵn
RUN apk add --no-cache bash

# Cấp quyền thực thi cho start.sh
RUN chmod +x start.sh

# Expose port 9000 (Medusa default)
EXPOSE 9000

# Chạy script start.sh bằng bash
CMD ["bash", "./start.sh"]
