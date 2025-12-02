const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
const url = require("url");
const https = require("https");

const app = express();

// --- CẤU HÌNH URL TỪ BIẾN MÔI TRƯỜNG ---
// Khi deploy, FRONTEND_URL sẽ là link Cloudflare của web bán hàng
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 8888;

// ✅ Cho phép React frontend truy cập
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000"], // Cho phép cả 2
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* =====================  VNPay Config  ===================== */
const vnp_TmnCode = "L9Z7VVA4"; 
const vnp_HashSecret = "0Z90VCURMZ3U3ZZMFXXXMIJOK2DWMO6G";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
// QUAN TRỌNG: VNPay phải trả về đường dẫn công khai của Frontend
const vnp_ReturnUrl = `${FRONTEND_URL}/vnpay-return`; 

app.post("/create_payment", (req, res) => {
  try {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const date = new Date();
    const createDate = date.toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14);
    const orderId = Math.floor(Math.random() * 1000000);
    const amount = req.body.amount || 20000;
    const orderInfo = req.body.orderInfo || "Thanh toan don hang demo";

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
      vnp_ReturnUrl: vnp_ReturnUrl, // Đã dùng biến động
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const redirectUrl = new url.URL(vnp_Url);

    Object.keys(vnp_Params).sort().forEach((key) => {
        const value = vnp_Params[key];
        if (value !== null && value !== undefined && value !== "") {
          redirectUrl.searchParams.append(key, value.toString());
        }
      });

    const signData = redirectUrl.searchParams.toString().replace(/%20/g, "+");
    const secureHash = crypto.createHmac("sha512", vnp_HashSecret).update(signData, "utf-8").digest("hex");

    redirectUrl.searchParams.append("vnp_SecureHash", secureHash);

    res.json({ code: "00", message: "success", data: redirectUrl.href });
  } catch (err) {
    console.error("VNPay Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =====================  MoMo Config  ===================== */
// ... (Giữ nguyên phần MoMo, chỉ cần lưu ý RedirectURL)
const momoRedirectUrl = `${FRONTEND_URL}/momo-return`; // Sửa dòng này

// ... (Phần code MoMo logic giữ nguyên) ...

/* =====================  Start Server  ===================== */
app.listen(PORT, () =>
  console.log(`✅ Payment Server chạy tại port: ${PORT}`)
);