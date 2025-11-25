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

# Copy Backend Core
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package.json ./package.json

# Copy Config
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# 👇👇👇 ĐÃ SỬA LỖI TẠI ĐÂY 👇👇👇
# Xóa dòng COPY public cũ bị lỗi
# Thay bằng lệnh tạo thư mục public rỗng (để tránh lỗi nếu code cần dùng nó)
RUN mkdir -p public

# Copy Admin từ .medusa/client ra thành thư mục build
COPY --from=builder /app/.medusa/client ./build

# Port
EXPOSE 9000

# Chạy server
CMD ["npm", "run", "start"]