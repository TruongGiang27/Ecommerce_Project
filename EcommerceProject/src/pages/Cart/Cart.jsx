import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import "./Cart.css";
import vnpayLogo from "../../images/vnpay-logo.png";
import momoLogo from "../../images/momo-logo.png";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [promo, setPromo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState([]);
  const [qrCode, setQrCode] = useState(null);
<<<<<<< HEAD
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingPromo, setLoadingPromo] = useState(false);

  // Voucher system
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const vouchers = [
    {
      id: 1,
      name: "Giảm 12% tối đa 40k",
      type: "percent",
      value: 12,
      maxDiscount: 40000,
      minOrder: 50000,
      description: "Đơn tối thiểu 50k",
    },
    {
      id: 2,
      name: "Giảm 50k cho đơn từ 200k",
      type: "fixed",
      value: 50000,
      minOrder: 200000,
      description: "Đơn tối thiểu 200k",
    },
    {
      id: 3,
      name: "Giảm 100k cho đơn từ 500k",
      type: "fixed",
      value: 100000,
      minOrder: 500000,
      description: "Đơn tối thiểu 500k",
    },
  ];

=======
  const PAYMENT_URL = process.env.REACT_APP_PAYMENT_URL;
  // sync selected default none
>>>>>>> e3c53243d78c6f88f0f26722427ead8fcda94da0
  useEffect(() => {
    setSelected([]);
  }, [cart]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Áp mã thủ công (Medusa)
  const applyPromo = async () => {
    const code = promo.trim();
    if (!code) {
      setErrorMessage("Vui lòng nhập mã giảm giá!");
      return;
    }

    setLoadingPromo(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        `http://localhost:9000/store/discounts/code/${encodeURIComponent(code)}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        setErrorMessage("❌ Mã không hợp lệ hoặc đã hết hạn!");
        setSelectedVoucher(null);
        setLoadingPromo(false);
        return;
      }

      const data = await res.json();
      if (!data?.discount) {
        setErrorMessage("❌ Mã không hợp lệ hoặc không tồn tại!");
        setSelectedVoucher(null);
        return;
      }

      const d = data.discount;

      setSelectedVoucher({
        id: d.id,
        name: d.code?.toUpperCase() || code,
        type: d.rule?.type === "percentage" ? "percent" : "fixed",
        value: d.rule?.value,
        maxDiscount: d.rule?.max_discount_amount || null,
        minOrder: d.rule?.conditions?.[0]?.value || 0,
        description: d.rule?.description || "Mã giảm giá từ Medusa",
      });

      alert(`✅ Mã "${code}" đã được áp dụng!`);
      setPromo("");
    } catch (error) {
      console.error("Lỗi khi kiểm tra mã:", error);
      setErrorMessage("⚠️ Không thể kiểm tra mã, vui lòng thử lại sau.");
    } finally {
      setLoadingPromo(false);
    }
  };

  // ✅ Hủy voucher
  const removeVoucher = () => {
    setSelectedVoucher(null);
    setPromo("");
    setErrorMessage("");
  };

  // ✅ Thanh toán
  const payVnpay = async () => {
    const res = await fetch(`${PAYMENT_URL}/create_payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const data = await res.json();
    if (data?.data) window.location.href = data.data;
  };

  const payMomo = async () => {
    const res = await fetch(`${PAYMENT_URL}/create-momo-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, orderInfo: "Thanh toán đơn hàng" }),
    });
    const data = await res.json();
    if (data?.payUrl) window.location.href = data.payUrl;
  };

  // ✅ Tính tổng tiền
  let subtotal = cart.reduce((sum, item) => {
    if (!selected.includes(item.id)) return sum;
    const variantPrice =
      item.selectedVariant?.price ||
      item?.variants?.[0]?.calculated_price?.calculated_amount ||
      0;
    return sum + (variantPrice || 0);
  }, 0);

  let discount = 0;
  if (selectedVoucher && subtotal >= selectedVoucher.minOrder) {
    if (selectedVoucher.type === "percent") {
      discount = Math.min(
        (subtotal * selectedVoucher.value) / 100,
        selectedVoucher.maxDiscount || Infinity
      );
    } else if (selectedVoucher.type === "fixed") {
      discount = selectedVoucher.value;
    }
  }

  const total = Math.max(subtotal - discount, 0);

  if (!cart.length) {
    return <div className="cart-empty">🛒 Giỏ hàng của bạn đang trống</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        {/* LEFT */}
        <div className="cart-left">
          <h2>Giỏ hàng ({cart.length} sản phẩm)</h2>

          {cart.map((item, index) => {
            const variantPrice =
              item.selectedVariant?.price ||
              item?.variants?.[0]?.calculated_price?.calculated_amount ||
              0;

            return (
              <div key={index} className="cart-row">
                <input
                  type="checkbox"
                  className="cart-check"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />

                <img
                  src={item.thumbnail || "https://via.placeholder.com/100"}
                  alt={item.title}
                />

                <div className="cart-info">
                  <h3>{item.title}</h3>

                  {item.selectedOptions &&
                    Object.keys(item.selectedOptions).length > 0 && (
                      <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                        {Object.entries(item.selectedOptions).map(([k, v]) => (
                          <span key={k} style={{ marginRight: 12 }}>
                            {`${k}: ${v}`}
                          </span>
                        ))}
                      </div>
                    )}

                  {item.selectedVariant?.title && (
                    <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                      {item.selectedVariant.title}
                    </div>
                  )}

                  <p className="price" style={{ marginTop: 8 }}>
                    {variantPrice.toLocaleString()} đ
                  </p>

                  <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
                    Số lượng: <strong>1</strong>
                  </div>
                </div>

                <button className="remove" onClick={() => removeFromCart(item.id)}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <div className="summary">
            <h3>Thanh toán</h3>

            {/* Mã giảm giá */}
            <div className="input-group">
              <label>Mã ưu đãi</label>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Nhập mã"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  disabled={!!selectedVoucher || loadingPromo}
                />
                <button
                  className="apply-btn"
                  onClick={applyPromo}
                  disabled={!!selectedVoucher || loadingPromo}
                >
                  {loadingPromo ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>

              {errorMessage && (
                <p className="error-text" style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                  {errorMessage}
                </p>
              )}

              {/* Voucher chọn */}
              <div className="voucher-section">
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="voucher-btn"
                >
                  {selectedVoucher
                    ? `🎟 ${selectedVoucher.name}`
                    : "Chọn mã giảm giá"}
                </button>

                {selectedVoucher && (
                  <button className="remove-voucher-btn" onClick={removeVoucher}>
                    ❌ Bỏ chọn voucher
                  </button>
                )}
              </div>
            </div>

            {/* Liên hệ */}
            <div className="input-group">
              <label>Liên hệ</label>
              <div className="input-row phone">
                <span className="prefix">+84</span>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label>Email</label>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="line">
              <span>Tạm tính</span>
              <strong>{subtotal.toLocaleString()} đ</strong>
            </div>
            {discount > 0 && (
              <div className="line discount">
                <span>Giảm giá</span>
                <strong>-{discount.toLocaleString()} đ</strong>
              </div>
            )}
            <div className="line total">
              <span>Tổng tiền</span>
              <strong>{total.toLocaleString()} đ</strong>
            </div>

            <div className="pay-alt">
              <button className="qr-btn vnpay-btn" onClick={payVnpay}>
                <img src={vnpayLogo} alt="VNPay" className="pay-logo" /> Thanh
                toán với VNPay QR
              </button>
              <button className="qr-btn momo-btn" onClick={payMomo}>
                <img src={momoLogo} alt="MoMo" className="pay-logo" /> Thanh toán
                với MoMo QR
              </button>
            </div>

            {qrCode && (
              <div className="qr-preview">
                <h4>Quét mã để thanh toán</h4>
                <img src={qrCode} alt="QR Code" className="qr-image" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chọn voucher */}
      {showVoucherModal && (
        <div className="voucher-modal">
          <div className="voucher-content">
            <h3>Chọn Voucher</h3>
            <div className="voucher-list">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className={`voucher-item ${
                    selectedVoucher?.id === v.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedVoucher(v)}
                >
                  <div className="voucher-left">
                    <div className="voucher-name">{v.name}</div>
                    <div className="voucher-desc">{v.description}</div>
                  </div>
                  <div className="voucher-right">
                    <input
                      type="radio"
                      checked={selectedVoucher?.id === v.id}
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="voucher-footer">
              <button onClick={() => setShowVoucherModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
