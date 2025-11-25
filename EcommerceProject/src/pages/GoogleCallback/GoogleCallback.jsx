// src/pages/GoogleCallback.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiAuthClient } from "../lib/medusa";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const { setAuthToken, fetchCustomer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateGoogleLogin = async () => {
      try {
        // Lấy query string (state, code, v.v.)
        const queryString = location.search;

        const response = await apiAuthClient.get(
  `/auth/google/callback${queryString}`
);


        if (response.data?.token) {
          const token = response.data.token;
          setAuthToken(token);
          await fetchCustomer(token);
          navigate("/"); // Redirect sau khi đăng nhập thành công
        } else {
          console.error("Không nhận được token từ Google callback:", response.data);
        }
      } catch (error) {
        console.error("Lỗi xác thực Google callback:", error);
      }
    };

    validateGoogleLogin();
  }, [location, navigate, setAuthToken, fetchCustomer]);

  return <div>Đang xác thực đăng nhập Google...</div>;
}
