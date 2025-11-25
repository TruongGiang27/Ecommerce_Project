// src/pages/Auth/ThirdPartyCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuthClient } from "../../lib/medusa";
import { useAuth } from "../../context/AuthContext";

export default function ThirdPartyCallback() {
  const [statusMsg, setStatusMsg] = useState("Đang xử lý đăng nhập...");
  const navigate = useNavigate();
  const { setAuthToken, fetchCustomer } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setStatusMsg("Xác thực với Medusa...");
        const query = window.location.search; // ?code=...&state=...
        if (!query) {
          setStatusMsg("Không có query params từ provider.");
          return;
        }

        console.log("[Callback] POST /auth/customer/google/callback", query);

        // Gọi validate callback theo docs
        const resp = await apiAuthClient.post(`/customer/google/callback${query}`);

        console.log("[Callback] response status:", resp.status);
        console.log("[Callback] response data:", resp.data);
        console.log("[Callback] response headers:", resp.headers);

        // Tìm token trong nhiều chỗ khả dĩ
        const token =
          resp.data?.token ||
          resp.data?.access_token ||
          resp.data?.data?.token ||
          (typeof resp.data === "string" ? resp.data : null);

        if (!token) {
          // Nếu backend set cookie (httpOnly), token có thể không ở body; log cảnh báo
          console.warn("[Callback] Không tìm thấy token trong response body.");
          setStatusMsg(
            "Xác thực thành công ở backend nhưng không trả token trong body. Kiểm tra cookie hoặc cấu hình backend."
          );
          // Hiện thử redirect home để xem cookie session có hoạt động không (nếu backend set cookie)
          // navigate("/");
          return;
        }

        // Lưu token vào localStorage và fetch customer
        console.log("[Callback] Lưu token vào localStorage...");
        setAuthToken(token);

        // xác nhận token đã lưu
        const stored = localStorage.getItem("medusa_auth_token");
        console.log("[Callback] token lưu trong localStorage:", stored ? "OK" : "NULL", stored);

        setStatusMsg("Lấy thông tin khách hàng...");
        await fetchCustomer(token);

        setStatusMsg("Đăng nhập thành công. Chuyển hướng...");
        navigate("/");
      } catch (err) {
        console.error("[Callback] Lỗi khi validate callback:", err.response?.data || err.message);
        setStatusMsg("Xác thực thất bại. Xem console/network để debug.");
      }
    })();
  }, [navigate, setAuthToken, fetchCustomer]);

  return <div>{statusMsg}</div>;
}
