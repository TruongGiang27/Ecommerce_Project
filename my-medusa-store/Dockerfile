# Dockerfile for Medusa v2 + Admin

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY package.json package-lock.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY . .

# --- Build Admin ---
# Move into admin folder
WORKDIR /app/src/admin

# Install admin dependencies
RUN npm install

# Build admin
RUN npm run build

# Move back to backend root
WORKDIR /app

# Expose Medusa default port
EXPOSE 9000

# Start Medusa with migrations
# CMD ["npx", "medusa", "develop"]
CMD ["sh", "-c", "npx medusa db:setup && npx medusa start"]

