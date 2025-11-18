# === STAGE 2: RUNNER - Image cuối cùng cho Runtime ===
FROM node:20-alpine AS runner

# ... (Thiết lập ENV/WORKDIR) ...

# Copy các file đã được Build và Dependencies
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.medusa /app/.medusa
# (Bạn đã copy những file này đúng)

# >>>>>>> HÀNH ĐỘNG CẦN BỔ SUNG: COPY CÁC FILE CẤU HÌNH CẦN THIẾT <<<<<<<
# 1. medusa-config.js (File cấu hình cốt lõi)
COPY medusa-config.js /app/medusa-config.js

# 2. tsconfig.json (Nếu có)
COPY tsconfig.json /app/tsconfig.json

# 3. start.sh (File khởi động)
COPY start.sh /app/start.sh

# 4. Các file khác (package.json/package-lock.json)
# Nếu bạn đã COPY chúng từ Builder, thì OK. Nếu không, cần copy:
COPY --from=builder /app/package.json /app/package.json
# ...
# >>>>>>> HẾT PHẦN BỔ SUNG <<<<<<<

# Lệnh khởi động (start.sh phải chạy migration + start)
CMD ["./start.sh"]