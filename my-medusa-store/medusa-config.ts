import { loadEnv, defineConfig } from "@medusajs/framework/utils";



loadEnv(process.env.NODE_ENV || "development", process.cwd());
console.log("✅ AUTH_CORS:", process.env.AUTH_CORS);
console.log("✅ STORE_CORS:", process.env.STORE_CORS);

// ----------------------------------------------------
// Bổ sung các biến môi trường cho Redis (Nếu cần thiết)
// ----------------------------------------------------
const REDIS_URL = process.env.REDIS_URL;

module.exports = defineConfig({
    // Removed unsupported top-level `cache` and `eventBus` keys;
    // Medusa expects Redis settings inside projectConfig (e.g. redisUrl).
    // ----------------------------------------------------

    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS!,
            adminCors: process.env.ADMIN_CORS!,
            authCors: process.env.AUTH_CORS!,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
        databaseDriverOptions: {
            ssl: false,
            // Cân nhắc bật SSL/sslmode: 'require' nếu dùng Production DB
            sslmode: "disable", 
        },
    },
});
