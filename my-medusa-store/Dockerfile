# ===============================================
# === STAGE 1: BUILDER - Cài đặt dependencies và Build code ===
# ===============================================
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc và ENV
WORKDIR /app
ENV NODE_ENV production

# 1. Tận dụng Cache cho Dependencies (CỰC KỲ QUAN TRỌNG)
# Chỉ cần copy file package.json và package-lock.json
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# 2. Copy mã nguồn còn lại và chạy Build Medusa
# Lệnh 'build' sẽ tạo ra các file cần thiết (.medusa/server, v.v.)
COPY . .
# Thêm tùy chọn tăng bộ nhớ cho Node.js trong khi Build (Giảm lỗi OOM trên các server giới hạn)
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build 

# ===============================================
# === STAGE 2: RUNNER - Image cuối cùng cho Runtime ===
# ===============================================
FROM node:20-alpine AS runner

# Thiết lập ENV
WORKDIR /app
ENV NODE_ENV production
ENV PORT 9000

# 1. Copy chỉ những thứ CẦN THIẾT từ giai đoạn BUILDER
# Chỉ copy các dependencies đã cài đặt và các file đã build.

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.medusa /app/.medusa
# 1. medusa-config.js (File cấu hình cốt lõi)
COPY medusa-config.js /app/medusa-config.js

# 2. tsconfig.json (Nếu có)
COPY tsconfig.json /app/tsconfig.json

# 3. start.sh (File khởi động)
COPY start.sh /app/start.sh

# 4. Copy các file cần thiết khác (nếu có)
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

# Copy các file cần thiết khác (start.sh, cấu hình, v.v.)
COPY ./start.sh ./

# Expose cổng (Không bắt buộc nhưng là tài liệu tốt)
EXPOSE 9000

# Lệnh khởi động (start.sh phải chạy migration + start)
CMD ["./start.sh"]