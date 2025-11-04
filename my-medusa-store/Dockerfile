# ========================
# Stage 1: Build
# ========================
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========================
# Stage 2: Run
# ========================
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

COPY --from=builder /app ./

# Chỉ install dependencies cần thiết cho production
RUN npm install --omit=dev

EXPOSE 9000

# ✅ Lệnh chạy Medusa production
CMD ["npm", "run", "start"]
