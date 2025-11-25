# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt các thư viện cần thiết
RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

COPY . .

# Build Medusa
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Cài libc6-compat
RUN apk add --no-cache libc6-compat

# Copy node_modules và source đã build từ builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package.json ./package.json

# Copy file config
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts

# 👇👇👇 DÒNG NÀY LÀ DÒNG BẠN ĐANG THIẾU 👇👇👇
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Port mặc định
EXPOSE 9000

# Lệnh chạy server
CMD ["npm", "run", "start"]