# =========================================================
# === STAGE 1: BUILDER - Cài đặt dependencies và Build code ===
# MỤC TIÊU: Caching dependencies và chạy quá trình nặng
# =========================================================
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc và ENV
WORKDIR /app
ENV NODE_ENV production

# 1. Tận dụng Cache cho Dependencies (CỰC KỲ QUAN TRỌNG)
# COPY package.json và package-lock.json để Docker Cache có thể sử dụng lại bước npm install
COPY package.json package-lock.json ./

# >>> HÀNH ĐỘNG FIX 1: COPY FILE CẤU HÌNH VÀO BUILD CONTEXT SỚM <<<
# Phải COPY các file .ts cấu hình (config/start) mà lệnh BUILD/MIGRATION sẽ cần.
COPY medusa-config.ts ./
COPY tsconfig.json ./
COPY start.sh ./
# -------------------------------------------------------------

RUN npm install --omit=dev

# 2. Copy mã nguồn còn lại và chạy Build Medusa
COPY . .
# Thêm tùy chọn tăng bộ nhớ (Giải quyết lỗi OOM trong quá trình Build)
# Chạy lệnh BUILD server (bao gồm cả biên dịch file .ts)
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build 

# ======================================================
# === STAGE 2: RUNNER - Image cuối cùng cho Runtime (Nhỏ gọn) ===
# MỤC TIÊU: Chỉ chứa những thứ cần thiết để chạy server
# ======================================================
FROM node:20-alpine AS runner

# Thiết lập ENV
WORKDIR /app
ENV NODE_ENV production
ENV PORT 9000

# 1. Copy chỉ những thứ CẦN THIẾT từ giai đoạn BUILDER
# COPY dependencies đã cài đặt và các file đã build.
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.medusa /app/.medusa

# >>> HÀNH ĐỘNG FIX 2: COPY FILE CẤU HÌNH CẦN THIẾT CHO RUNTIME <<<
# Copy file .ts cấu hình gốc để Medusa có thể tìm thấy chúng
COPY --from=builder /app/medusa-config.ts /app/medusa-config.ts
COPY --from=builder /app/tsconfig.json /app/tsconfig.json
COPY --from=builder /app/start.sh /app/start.sh
# ----------------------------------------------------------------

# 2. Copy các file package (Cần thiết cho lệnh start)
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

# Expose cổng (Dành cho tài liệu)
EXPOSE 9000

# Lệnh khởi động (start.sh phải chạy migration + start)
CMD ["./start.sh"]