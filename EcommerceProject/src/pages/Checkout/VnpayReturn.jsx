import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VnpayReturn.css";
import { useDispatch, useSelector } from "react-redux";
import { completeCart } from "../../services/order";
import { clearCartId } from "../../redux/slices/cartSlice";

export default function VnpayReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartIdSelector = useSelector((state) => state.cart.cartId);
  console.log("Cart ID từ Redux:", cartIdSelector);

  const isProcessed = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(searchParams.entries());

  const success = params.vnp_ResponseCode === "00" || params.resultCode === "0";

  useEffect(() => {
    const buyNow = async () => {
      try {
        await completeCart(cartIdSelector);

        console.log("Đơn hàng đã được xử lý sau thanh toán VNPay thành công.");

        dispatch(clearCartId());

        console.log("Đã clear Redux sau thanh toán VNPay.");
      } catch (err) {
        console.error("Lỗi khi xử lý đơn hàng sau thanh toán VNPay:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    };

    if (
      success &&
      !isProcessed.current // Chỉ chạy nếu chưa từng chạy
    ) {
      // Khóa ngay lập tức (Sync) để chặn lần gọi thứ 2
      isProcessed.current = true;

      console.log("Bắt đầu xử lý đơn hàng...");
      buyNow();
    }
  }, [success, cartIdSelector, dispatch]);

  return (
    <div className="vnpay-return-wrapper">
      <div className="vnpay-card">
        <h1 className="vnpay-title">Thanh toán</h1>

        <div className={`vnpay-status ${success ? "success" : "failed"}`}>
          {success ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại"}
        </div>

        <div className="vnpay-details">
          <div className="detail-row">
            <span>Mã đơn hàng:</span>
            <strong>{params.vnp_TxnRef || params.transId || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Số tiền:</span>
            <strong>
              {params.vnp_Amount
                ? (params.vnp_Amount / 100).toLocaleString() + " đ"
                : params.amount
                ? Number(params.amount).toLocaleString() + " đ"
                : "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Mã phản hồi VNPay:</span>
            <strong>
              {params.vnp_ResponseCode || params.requestId || "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Ngày giao dịch:</span>
            <strong>
              {params.vnp_PayDate
                ? params.vnp_PayDate.replace(
                    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                    "$3/$2/$1 $4:$5:$6"
                  )
                : params.responseTime
                ? new Date(Number(params.responseTime)).toLocaleString("vi-VN") // Xử lý nếu có responseTime
                : "-"}
            </strong>
          </div>

          {params.vnp_BankCode ? (
            <div className="detail-row">
              <span>Ngân hàng:</span>
              <strong>{params.vnp_BankCode}</strong>
            </div>
          ) : (
            null
          )}

          {params.orderType === 'momo_wallet' ? (
            <div className="detail-row">
              <span>Phương thức thanh toán:</span>
              <strong>Momo Wallet</strong>
            </div>
          ) : (
            <div className="detail-row">
              <span>Phương thức thanh toán:</span>
              <strong>VNPAY</strong>
            </div>
          )}
        </div>

        <button className="vnpay-back-btn" onClick={() => navigate("/")}>
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
