# Medusa Backend

Dự án này sử dụng [Medusa.js](https://docs.medusajs.com/) làm **headless commerce backend**.

## Yêu cầu hệ thống

Trước khi chạy backend, hãy cài đặt các công cụ sau:

- [Node.js](https://nodejs.org/) (phiên bản **>=16**)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (cài đặt local hoặc dùng dịch vụ cloud)
- [Redis](https://redis.io/) (dùng cho caching, queues)

---

## Cài đặt

Clone repository

```bash
git clone https://github.com/QuocB-HC/MedusaJS_Test.git
```

### Frontend

Cài dependencies

```bash
cd my-store
npm install
```

Truy cập server

```bash
npm start
```

### Backend

Cài dependencies

```bash
cd my-medusa-store
npm install
dos2unix start.sh
```

Cài đặt Docker

- Truy cập https://www.docker.com/products/docker-desktop/
- Tải Docker Desktop

Chạy docker

```bash
npm run docker:up
docker compose logs -f
```

Truy cập server

```bash
✔ Server is ready on port: 9000 – 3ms
info:    Admin URL → http://localhost:9000/app
```

Tạo tài khoản admin

```bash
docker compose run --rm medusa npx medusa user -e long.admin@gmail.com -p 123456
```

docker compose exec backend sh
npx medusa user -e admin@medusa.local -p 123456

docker compose run --rm medusa npx medusa user -e admin.long@example.com -p 123456789

``` start.sh mẫu
#!/bin/sh

# Run migrations and start server
echo "Running database migrations..."
npx medusa db:migrate

echo "Seeding database..."
npm run seed || echo "Seeding failed, continuing..."

echo "Starting Medusa development server..."
npm run dev

``` Dockerfile mẫu

# Development Dockerfile for Medusa
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and npm config
COPY package.json package-lock.json ./

# Install all dependencies using npm
RUN npm install

# Copy source code
COPY . .

# Expose the port Medusa runs on
EXPOSE 9000

# Start with migrations and then the development server
CMD ["./start.sh"]