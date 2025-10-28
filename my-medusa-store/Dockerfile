# Giai đoạn 1: Build Stage (Cài đặt dependencies và Build Admin)
FROM node:20-alpine AS build
WORKDIR /app

# 1. Copy package files (nguồn cache)
COPY package.json package-lock.json ./ 

# 2. Cài đặt TẤT CẢ Dependencies (BAO GỒM devDeps để build TS)
# Lần này chúng ta không dùng --omit=dev để đảm bảo ts-node và typescript có sẵn.
RUN npm install

# 3. Copy toàn bộ mã nguồn VÀ cấu hình
# BẮT BUỘC trước khi chạy lệnh build và các lệnh cần config
COPY . .

# 4. Build Medusa Backend (Biên dịch TypeScript sang Dist)
# Lệnh 'medusa build' biên dịch code TS và tạo thư mục 'dist'
RUN npm run build

# ----------------------------------------------------------------------
# Giai đoạn 2: Production Runtime Image (Nhẹ hơn)
FROM node:20-alpine AS final
WORKDIR /app

# 1. Cài đặt lại chỉ dependencies cần thiết cho runtime (Production)
# Chúng ta cài lại để loại bỏ devDependencies không cần thiết.
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# 2. Copy code đã build và script khởi động
# Copy start.sh SỚM hơn để tránh lỗi cache ở các bước COPY sau
COPY start.sh ./

# Đảm bảo dist đã được tạo ở giai đoạn build
COPY --from=build /app/dist ./dist

# Expose cổng (Mặc định là 9000, hoặc tùy vào biến PORT)
EXPOSE 9000

# Lệnh khởi động (sử dụng start.sh đã được sửa để gọi npm run start)
CMD ["sh", "start.sh"]
