# Use Node.js 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build admin panel (nếu có)
RUN cd src/admin && npm install && npm run build

# Expose port for Medusa
EXPOSE 9000

# Start server
CMD ["./start.sh"]
