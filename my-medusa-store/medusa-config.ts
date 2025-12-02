import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

// --- DEBUG LOGS (Giúp kiểm tra xem biến môi trường có vào được không) ---
console.log("-----------------------------------------------------");
console.log("🔍 DEBUG CONFIG:");
console.log("✅ NODE_ENV:", process.env.NODE_ENV);
console.log("✅ DATABASE_URL:", process.env.DATABASE_URL ? "Found (Hidden)" : "❌ MISSING");
console.log("✅ REDIS_URL:", process.env.REDIS_URL ? "Found" : "❌ MISSING");
console.log("-----------------------------------------------------");

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {

      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },

    databaseDriverOptions: {
      connection: {
        // ssl: { rejectUnauthorized: false }, // <--- Đã comment dòng này
      },
    },
  },
});