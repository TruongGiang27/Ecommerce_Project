FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8888
CMD ["node", "server.js"] 
# Lưu ý: thay index.js bằng tên file code thực tế của bạn (ví dụ server.js)