# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt thư viện hệ thống cần thiết
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build Medusa (Admin sẽ được tạo ra tại .medusa/client)
RUN npm run build

# --- Stage 2: Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Cài libc6-compat
RUN apk add --no-cache libc6-compat

# 1. Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# 2. Copy Backend Core (.medusa chứa code server)
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package.json ./package.json

# 3. Copy Configs
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# 4. Tạo các thư mục đích trước để tránh lỗi
RUN mkdir -p build && mkdir -p public && mkdir -p .medusa/server/public/admin

# 👇👇👇 SỬA LỖI QUAN TRỌNG: COPY ADMIN VÀO 2 CHỖ 👇👇👇

# Chỗ 1: Copy vào /app/build (Nơi server thường tìm kiếm mặc định và báo lỗi)
COPY --from=builder /app/.medusa/client ./build

# Chỗ 2: Copy vào cấu trúc nội bộ của Medusa v2 (Dự phòng)
COPY --from=builder /app/.medusa/client ./.medusa/server/public/admin

# Port
EXPOSE 9000

# Chạy server
CMD ["npm", "run", "start"]