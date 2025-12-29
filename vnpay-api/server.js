/**
 * ===================== PAYMENT SERVER =====================
 * - VNPay + MoMo
 * - Fix CORS triệt để cho Vercel + Cloudflare Tunnel
 * - Không dùng cors() package
 * ==========================================================
 */

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const url = require("url");
const https = require("https");

const app = express();

/* ==========================================================
   ENV
   ========================================================== */
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 8888;

/* ==========================================================
   🔥 GLOBAL CORS FIX (QUAN TRỌNG NHẤT)
   - BẮT BUỘC đặt trên cùng
   - Cloudflare + Docker bắt OPTIONS trước
   ========================================================== */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    FRONTEND_URL
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ==========================================================
   BODY PARSER
   ========================================================== */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ==========================================================
   TEST / DEBUG ROUTE (DÙNG ĐỂ CHECK CLOUD FLARE)
   ========================================================== */
app.get("/", (req, res) => {
  res.send("🚀 Payment server is running");
});

app.get("/__debug", (req, res) => {
  res.json({
    service: "payment-server",
    originReceived: req.headers.origin || null,
    frontendAllowed: FRONTEND_URL,
    time: new Date().toISOString(),
  });
});

/* ==========================================================
   ===================== VNPay CONFIG =======================
   ========================================================== */
const vnp_TmnCode = "L9Z7VVA4"; // sandbox
const vnp_HashSecret =
  "0Z90VCURMZ3U3ZZMFXXXMIJOK2DWMO6G";
const vnp_Url =
  "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = `${FRONTEND_URL}/vnpay-return`;

/* ------------------- CREATE VNPAY PAYMENT ---------------- */
app.post("/create_payment", (req, res) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);

    const orderId = Math.floor(Math.random() * 1000000);
    const amount = req.body.amount || 20000;
    const orderInfo =
      req.body.orderInfo || "Thanh toan don hang";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const redirectUrl = new url.URL(vnp_Url);

    Object.keys(vnp_Params)
      .sort()
      .forEach((key) => {
        const value = vnp_Params[key];
        if (value !== undefined && value !== null && value !== "") {
          redirectUrl.searchParams.append(
            key,
            value.toString()
          );
        }
      });

    const signData = redirectUrl.searchParams
      .toString()
      .replace(/%20/g, "+");

    const secureHash = crypto
      .createHmac("sha512", vnp_HashSecret)
      .update(signData, "utf-8")
      .digest("hex");

    redirectUrl.searchParams.append(
      "vnp_SecureHash",
      secureHash
    );

    return res.json({
      code: "00",
      message: "success",
      data: redirectUrl.href,
    });
  } catch (err) {
    console.error("VNPay Error:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

/* ==========================================================
   ====================== MOMO CONFIG =======================
   ========================================================== */
const accessKey =
  process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
const secretKey =
  process.env.MOMO_SECRET_KEY ||
  "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const partnerCode =
  process.env.MOMO_PARTNER_CODE || "MOMO";

const momoRedirectUrl = `${FRONTEND_URL}/momo-return`;
const ipnUrl =
  "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";

/* ------------------- CREATE MOMO PAYMENT ----------------- */
app.post("/create-momo-payment", (req, res) => {
  try {
    const amount = req.body.amount || "50000";
    const orderInfo =
      req.body.orderInfo || "Pay with MoMo";
    const requestType = "payWithMethod";
    const orderId = partnerCode + Date.now();
    const requestId = orderId;
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      momoRedirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoRedirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      let data = "";
      momoRes.on("data", (chunk) => (data += chunk));
      momoRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          res.json(json);
        } catch (e) {
          res.status(500).json({
            error: "Invalid JSON from MoMo",
            raw: data,
          });
        }
      });
    });

    momoReq.on("error", (e) => {
      res.status(500).json({ error: e.message });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================================
   START SERVER
   ========================================================== */
app.listen(PORT, () => {
  console.log(`✅ Payment server running on port ${PORT}`);
  console.log(`✅ Allowed Frontend: ${FRONTEND_URL}`);
});
