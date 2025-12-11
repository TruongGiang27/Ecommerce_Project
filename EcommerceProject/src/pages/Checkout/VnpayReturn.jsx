import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VnpayReturn.css";
import { useDispatch, useSelector } from "react-redux";
import { processCheckout } from "../../services/order";
import { clearAllVariants } from "../../redux/slices/variantSlice";
import { resetCustomerInfo } from "../../redux/slices/customerInfoSlice";

export default function VnpayReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const variantsSelector = useSelector((state) => state.variant.selections);
  const customerInfoSelector = useSelector((state) => state.customerInfo);

  const isProcessed = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(searchParams.entries());

  const success = params.vnp_ResponseCode === "00";

  useEffect(() => {
    const buyNow = async () => {
      try {
        const customerInfo = {
          email: customerInfoSelector.email,
          address: {
            first_name: customerInfoSelector.address.first_name,
            last_name: customerInfoSelector.address.last_name,
            address_1: customerInfoSelector.address.address_1,
            city: customerInfoSelector.address.city,
            country_code: "vn",
            postal_code: "700000",
            phone: customerInfoSelector.address.phone,
          },
          promoCodes: customerInfoSelector.promoCodes,
        };

        console.log("Variant: ", variantsSelector);
        console.log("Customer Info: ", customerInfo);

        await processCheckout(variantsSelector, 1, customerInfo);

        console.log("Đơn hàng đã được xử lý sau thanh toán VNPay thành công.");

        dispatch(clearAllVariants());
        dispatch(resetCustomerInfo());

        console.log("Đã clear Redux sau thanh toán VNPay.");
      } catch (err) {
        console.error("Lỗi khi xử lý đơn hàng sau thanh toán VNPay:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    };

    if (
      success &&
      variantsSelector.length > 0 &&
      !isProcessed.current // Chỉ chạy nếu chưa từng chạy
    ) {
      // Khóa ngay lập tức (Sync) để chặn lần gọi thứ 2
      isProcessed.current = true;

      console.log("Bắt đầu xử lý đơn hàng...");
      buyNow();
    }
  }, [success, variantsSelector, customerInfoSelector, dispatch]);

  return (
    <div className="vnpay-return-wrapper">
      <div className="vnpay-card">
        <h1 className="vnpay-title">Thanh toán VNPay</h1>

        <div className={`vnpay-status ${success ? "success" : "failed"}`}>
          {success ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại"}
        </div>

        <div className="vnpay-details">
          <div className="detail-row">
            <span>Mã đơn hàng:</span>
            <strong>{params.vnp_TxnRef || "-"}</strong>
          </div>
          <div className="detail-row">
            <span>Số tiền:</span>
            <strong>
              {params.vnp_Amount
                ? (params.vnp_Amount / 100).toLocaleString() + " đ"
                : "-"}
            </strong>
          </div>
          <div className="detail-row">
            <span>Mã phản hồi VNPay:</span>
            <strong>{params.vnp_ResponseCode || "-"}</strong>
          </div>
          <div className="detail-row">
            <span>Ngày giao dịch:</span>
            <strong>
              {params.vnp_PayDate
                ? params.vnp_PayDate.replace(
                    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                    "$3/$2/$1 $4:$5:$6"
                  )
                : "-"}
            </strong>
          </div>
          <div className="detail-row">
            <span>Ngân hàng:</span>
            <strong>{params.vnp_BankCode || "-"}</strong>
          </div>
        </div>

        <button className="vnpay-back-btn" onClick={() => navigate("/")}>
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
