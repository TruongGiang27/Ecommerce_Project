import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  CreditCard,
  Ticket,
  ShieldCheck,
  Loader2,
  ShoppingBag,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import styles from "./ConfirmPayment.module.css";
import { useParams } from "react-router-dom";
import { getCartByID } from "../../services/order";

// --- HELPER FUNCTIONS ---
const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ConfirmPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentUrl = process.env.REACT_APP_PAYMENT_URL;

  const { id } = useParams();
  const [currentCart, setCurrentCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      if (!id) return;

      try {
        console.log("Start fetching cart ID:", id);
        const data = await getCartByID(id);

        setCurrentCart(data);
        console.log("Fetched Cart Data:", data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Có lỗi xảy ra khi tải thông tin giỏ hàng.");
      }
    };

    fetchCartData();
  }, [id]);

  const activePromotion = useMemo(() => {
    // Dòng này để chặn lỗi khi dữ liệu chưa tải xong
    if (!currentCart) return null;

    // Nếu tổng tiền giảm = 0 thì coi như không có mã
    if (!currentCart.discount_total || currentCart.discount_total === 0) return null;

    // Tìm mã code đầu tiên trong các items
    let foundCode = "DISCOUNT"; // Giá trị mặc định nếu không tìm thấy code

    // Duyệt tìm code thật
    for (const item of currentCart.items) {
      if (item.adjustments && item.adjustments.length > 0) {
        foundCode = item.adjustments[0].code;
        break; // Tìm thấy 1 cái là dừng luôn
      }
    }

    return {
      code: foundCode,
      amount: currentCart.discount_total, // Lấy tổng giảm giá của cả giỏ hàng
    };
  }, [currentCart]);

  

  const payment = async () => {
    setIsProcessing(true);

    if (paymentMethod === "vnpay") {
      const res = await fetch(`${paymentUrl}/create_payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: currentCart.total }),
      });

      const data = await res.json();
      if (data?.data) window.location.href = data.data;

      setIsProcessing(false);
    } else if (paymentMethod === "momo") {
      const res = await fetch(`${paymentUrl}/create-momo-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: currentCart.total,
          orderInfo: "Thanh toán đơn hàng",
        }),
      });

      const data = await res.json();
      if (data?.payUrl) window.location.href = data.payUrl;

      setIsProcessing(false);
    } else {
        alert("Vui lòng chọn phương thức thanh toán.");
        setIsProcessing(false);
    }
  };

  if (!currentCart) {
    return <div>Đang tải thông tin giỏ hàng...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>    
        <div className={styles.gridLayout}>
          {/* --- LEFT COLUMN --- */}
          <div className={styles.mainContent}>
            {/* Address */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <MapPin className={styles.iconBlue} size={20} />
                <h3>Địa chỉ nhận hàng</h3>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.customerName}>
                  {currentCart.shipping_address.first_name}{" "}
                  {currentCart.shipping_address.last_name}
                  <span className={styles.phone}>
                    ({currentCart.shipping_address.phone})
                  </span>
                </p>

                <p className={styles.addressText}>
                  {currentCart.shipping_address.address_1}
                </p>

                <p className={styles.addressText}>
                  {currentCart.shipping_address.city}, Việt Nam
                </p>
              </div>
            </div>

            {/* Section: Payment Method */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <CreditCard className={styles.iconBlue} size={20} />
                <h3>Phương thức thanh toán</h3>
              </div>

              <div className={styles.paymentList}>
                {/* --- TÙY CHỌN 1: VNPAY --- */}
                <label
                  className={`${styles.paymentOption} ${
                    paymentMethod === "vnpay" ? styles.selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className={styles.paymentIconBox}>
                    {/* Logo VNPAY */}
                    <img
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                      alt="VNPAY"
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentTitle}>VNPAY</span>
                    <span className={styles.paymentSub}>
                      Quét mã QR qua ứng dụng ngân hàng
                    </span>
                  </div>
                  {paymentMethod === "vnpay" && (
                    <CheckCircle className={styles.checkIcon} size={20} />
                  )}
                </label>

                {/* --- TÙY CHỌN 2: MOMO --- */}
                <label
                  className={`${styles.paymentOption} ${
                    paymentMethod === "momo" ? styles.selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === "momo"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className={styles.paymentIconBox}>
                    {/* Logo MOMO */}
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                      alt="MOMO"
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentTitle}>Ví MoMo</span>
                    <span className={styles.paymentSub}>
                      Thanh toán siêu tốc qua ứng dụng MoMo
                    </span>
                  </div>
                  {paymentMethod === "momo" && (
                    <CheckCircle className={styles.checkIcon} size={20} />
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Sidebar) --- */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <ShoppingBag size={20} />
                <h3>Đơn hàng ({currentCart.items.length})</h3>
              </div>

              {/* Items List */}
              <div className={styles.itemsList}>
                {currentCart.items.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <img
                      src={item.thumbnail}
                      alt={item.product_title}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <p className={styles.itemTitle}>{item.product_title}</p>
                      <p className={styles.itemVariant}>{item.variant_title}</p>
                      <div className={styles.itemPriceRow}>
                        <span className={styles.qtyBadge}>
                          x{item.quantity}
                        </span>
                        <span className={styles.price}>
                          {formatVND(item.unit_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.divider}></div>

              {/* Cost Breakdown */}
              <div className={styles.costBreakdown}>
                <div className={styles.costRow}>
                  <span>Tạm tính</span>
                  <span>{formatVND(currentCart.subtotal)}</span>
                </div>

                {/* --- UI MỚI: CHỈ HIỂN THỊ 1 PROMOTION --- */}
                {activePromotion && (
                  <div className={styles.promotionBox}>
                    <div className={styles.promoRow}>
                      <div className={styles.promoCode}>
                        <Ticket size={14} />
                        {/* Hiển thị tên mã */}
                        <span>{activePromotion.code}</span>
                      </div>

                      {/* Hiển thị tổng tiền giảm */}
                      <span>-{formatVND(activePromotion.amount)}</span>
                    </div>
                  </div>
                )}

                <div className={styles.costRow}>
                  <span>Phí vận chuyển</span>
                  <span className={styles.freeShip}>Miễn phí</span>
                </div>
              </div>

              <div className={styles.divider}></div>

              {/* Total */}
              <div className={styles.totalRow}>
                <div>
                  <p>Tổng cộng</p>
                  <p className={styles.savedText}>
                    Tiết kiệm {formatVND(currentCart.discount_total)}
                  </p>
                </div>

                <span className={styles.finalPrice}>
                  {formatVND(currentCart.total)}
                </span>
              </div>

              {/* Payment Button */}
              <button
                className={styles.checkoutBtn}
                onClick={payment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className={styles.spin} />
                ) : (
                  "Thanh toán ngay"
                )}
              </button>

              <p className={styles.secureNote}>
                <ShieldCheck size={12} /> Bảo mật thanh toán SSL 100%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
