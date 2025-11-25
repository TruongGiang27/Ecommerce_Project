# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt thư viện hệ thống
RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

COPY . .

# Build Medusa (Admin sẽ được tạo ra tại .medusa/client)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Cài libc6-compat
RUN apk add --no-cache libc6-compat

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy Backend Core (.medusa chứa .medusa/server và .medusa/client)
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package.json ./package.json

# Copy Config
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Tạo thư mục public rỗng (tránh lỗi not found)
RUN mkdir -p public

# 👇👇👇 CHIẾN THUẬT RẢI THẢM: COPY VÀO MỌI CHỖ CÓ THỂ 👇👇👇

# 1. Copy vào thư mục gốc /app/build (Nơi Medusa thường tìm nhất)
COPY --from=builder /app/.medusa/client ./build

# 2. Copy vào thư mục /app/.medusa/admin (Nơi cấu trúc Medusa v2 đôi khi tìm)
# Lệnh này sẽ tự tạo thư mục admin nếu chưa có
COPY --from=builder /app/.medusa/client ./.medusa/admin

# Port
EXPOSE 9000

# Chạy server
CMD ["npm", "run", "start"]