# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt các thư viện cần thiết cho hệ thống (Python, make, g++ cho native modules)
RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

COPY . .

# Build Medusa (Lệnh này sẽ tự động build cả Admin Dashboard)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Cài libc6-compat để chạy ổn định trên Alpine
RUN apk add --no-cache libc6-compat

# Copy node_modules và source đã build từ builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package.json ./package.json

# Copy các file config quan trọng
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
# Nếu bạn có file .env.template thì copy vào, nhưng KHÔNG copy .env thật

# Port mặc định
EXPOSE 9000

# Lệnh chạy server (KHÔNG chạy migration ở đây để an toàn)
CMD ["npm", "run", "start"]