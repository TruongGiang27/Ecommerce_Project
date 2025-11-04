import { loadEnv, defineConfig } from "@medusajs/framework/utils";



loadEnv(process.env.NODE_ENV || "development", process.cwd());
console.log("✅ AUTH_CORS:", process.env.AUTH_CORS);
console.log("✅ STORE_CORS:", process.env.STORE_CORS);

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },
  },
  // modules: [
  //   // ...
  //   {
  //     resolve: "@medusajs/medusa/auth",
  //     dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
  //     options: {
  //       providers: [
  //         // other providers...
  //         {
  //           resolve: "@medusajs/medusa/auth-emailpass",
  //           id: "emailpass",
  //         },
  //         {
  //           resolve: "@medusajs/medusa/auth-google",
  //           id: "google",
  //           options: {
  //             clientId: process.env.GOOGLE_CLIENT_ID,
  //             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //             callbackUrl:
  //               process.env.GOOGLE_CALLBACK_URL ||
  //               "http://localhost:3000/auth/callback",
  //             successRedirect: "http://localhost:3000/auth/callback", // hoặc "/" rồi xử lý token nếu backend appends token
  //             failureRedirect:
  //               "http://localhost:3000/login?error=google_login_failed",
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ],
});
