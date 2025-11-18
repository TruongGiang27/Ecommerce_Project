# =========================================================
# === STAGE 1: BUILDER - Cài đặt dependencies và Build code ===
# MỤC TIÊU: Tận dụng Build Cache và chạy quá trình nặng
# =========================================================
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc và ENV
WORKDIR /app
ENV NODE_ENV production

# 1. Tận dụng Cache cho Dependencies (CẦN file cấu hình để Build)
# COPY file cấu hình CỐT LÕI VÀO SỚM
COPY package.json package-lock.json ./
# >>> HÀNH ĐỘNG FIX 1: COPY FILE CẤU HÌNH VÀO BUILD CONTEXT <<<
# Phải COPY các file mà các lệnh BUILD/MIGRATION sẽ cần
COPY medusa-config.js ./ 
COPY tsconfig.json ./
COPY start.sh ./
# -------------------------------------------------------------

RUN npm install --omit=dev

# 2. Copy mã nguồn còn lại và chạy Build Medusa
COPY . .
# Thêm tùy chọn tăng bộ nhớ (Giảm lỗi OOM)
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build 

# ===============================================
# === STAGE 2: RUNNER - Image cuối cùng cho Runtime ===
# MỤC TIÊU: Chỉ chứa những thứ cần thiết để chạy
# ===============================================
FROM node:20-alpine AS runner

# Thiết lập ENV
WORKDIR /app
ENV NODE_ENV production
ENV PORT 9000

# 1. Copy chỉ những thứ CẦN THIẾT từ giai đoạn BUILDER
# Chỉ copy các dependencies đã cài đặt và các file đã build.

# COPY dependencies và file đã build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.medusa /app/.medusa

# >>> HÀNH ĐỘNG FIX 2: COPY FILE CẤU HÌNH TỪ BUILDER IMAGE <<<
# Thay vì COPY từ context (lệnh bị lỗi), giờ ta COPY từ BUILDER IMAGE đã có file
COPY --from=builder /app/medusa-config.js /app/medusa-config.js
COPY --from=builder /app/tsconfig.json /app/tsconfig.json
COPY --from=builder /app/start.sh /app/start.sh
# ----------------------------------------------------------------

# 2. Copy các file package (Để lệnh start vẫn chạy được)
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

# Expose cổng (Dành cho tài liệu)
EXPOSE 9000

# Lệnh khởi động (start.sh phải chạy migration + start)
CMD ["./start.sh"]