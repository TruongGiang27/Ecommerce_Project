FROM node:20-alpine

WORKDIR /app

# 1. Copy package files trước để cài đặt dependencies
COPY package.json yarn.lock* package-lock.json* ./

# 2. Cài đặt dependencies
RUN npm install

# 3. QUAN TRỌNG: Thêm node_modules/.bin vào PATH để tìm thấy lệnh 'medusa'
ENV PATH /app/node_modules/.bin:$PATH

# 4. Copy toàn bộ code vào
COPY . .

# 5. Build Medusa (Bước này sẽ tạo ra folder .medusa chứa server và client/admin)
RUN npm run build

# 6. Mở port
EXPOSE 9000

# 7. Start server (Dùng npx medusa start để chắc chắn chạy đúng binary)
CMD ["npx", "medusa", "start"]