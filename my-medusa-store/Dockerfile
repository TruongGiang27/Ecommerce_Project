# # Development Dockerfile for Medusa
# FROM node:20-alpine

# # Set working directory
# WORKDIR /app

# # Copy package files and npm config
# COPY package.json package-lock.json ./

# # Install all dependencies using npm
# RUN npm install

# # Copy source code
# COPY . .

# # Expose the port Medusa runs on
# EXPOSE 9000

# # Start with migrations and then the development server
# CMD ["./start.sh"]



# Giai đoạn 1: Build Stage (Cài đặt dependencies và Build Admin)
FROM node:20-alpine AS build
WORKDIR /app

# 1. Copy package files (không cache)
COPY package.json package-lock.json ./ 

# 2. Cài đặt Dependencies (không cache)
RUN npm install --omit=dev

# 3. Copy toàn bộ mã nguồn VÀ cấu hình
# BẮT BUỘC trước khi chạy lệnh build và các lệnh cần config
COPY . .

# 4. Build Admin Dashboard (BẮT BUỘC cho production)
# Lệnh này tạo ra các file tĩnh cần thiết cho Admin
RUN npm run build 

# ----------------------------------------------------------------------
# Giai đoạn 2: Production Runtime Image (Nhẹ hơn)
FROM node:20-alpine AS final
WORKDIR /app

# 1. Copy dependencies và code đã build từ Build Stage
# Điều này đảm bảo tất cả các file node_modules và build admin đều có mặt
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json start.sh ./

# Expose cổng (Mặc định là 9000, hoặc tùy vào biến PORT)
EXPOSE 9000

# Lệnh khởi động (sử dụng start.sh đã được sửa để gọi npm run start)
CMD ["sh", "start.sh"]
