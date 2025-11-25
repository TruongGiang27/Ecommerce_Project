# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt thư viện hệ thống
RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

COPY . .

# Build Medusa (Tạo ra folder .medusa chứa mọi thứ)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Cài libc6-compat
RUN apk add --no-cache libc6-compat

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy Backend Core (Copy TRỌN GÓI folder .medusa để không sót file nào)
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package.json ./package.json

# Copy Config
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Tạo thư mục build và public rỗng trước
RUN mkdir -p build && mkdir -p public

# Port
EXPOSE 9000

# 👇👇👇 CHIẾN THUẬT QUAN TRỌNG NHẤT 👇👇👇
# Lệnh này làm 3 việc:
# 1. In ra màn hình xem file index.html đang trốn ở đâu (để debug nếu cần)
# 2. Copy folder .medusa/client (nơi chứa Admin) ra folder build (nơi Server cần)
# 3. Chạy Server
CMD ["sh", "-c", "echo 'Searching for Admin...' && ls -R .medusa | grep index.html && cp -r .medusa/client/* build/ && echo 'Admin copied to build!' && npm run start"]