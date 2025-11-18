import { defineConfig } from "vite"

export default defineConfig({
  server: {
    allowedHosts: [
      "ecommerceproject-production-679b.up.railway.app",
      ".railway.app" // Cho phép tất cả subdomain của railway nếu cần
    ]
  }
})