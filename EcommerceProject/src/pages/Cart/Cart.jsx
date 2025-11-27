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
  const [selected, setSelected] = useState([]); // checked items
  const [qrCode, setQrCode] = useState(null);
  const PAYMENT_URL = process.env.REACT_APP_PAYMENT_URL;
  // sync selected default none
  useEffect(() => {
    setSelected([]);
  }, [cart]);

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const applyPromo = () => {
    alert(`Mã ưu đãi: ${promo || "Chưa nhập"}`);
  };

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
    const res = await fetch("http://localhost:8888/create-momo-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, orderInfo: "Thanh toán đơn hàng" }),
    });
    const data = await res.json();
    if (data?.payUrl) window.location.href = data.payUrl;
  };

  // total = sum of prices of checked items (each item quantity = 1)
  const total = cart.reduce((sum, item) => {
    if (!selected.includes(item.id)) return sum;
    const variantPrice = item.selectedVariant?.price || (item?.selectedVariant?.price ?? 0);
    // variantPrice expected in VND unit (299000 etc)
    return sum + (variantPrice || 0);
  }, 0);

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
            const variantPrice = item.selectedVariant?.price || (item?.variants?.[0]?.calculated_price?.calculated_amount || 0);

            return (
              <div key={index} className="cart-row">
                <input
                  type="checkbox"
                  className="cart-check"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />

                <img src={item.thumbnail || "https://via.placeholder.com/100"} alt={item.title} />

                <div className="cart-info">
                  {/* title already contains friendly label from ProductDetail */}
                  <h3>{item.title}</h3>

                  {/* Show readable selected options (optionTitle: value) */}
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                      {Object.entries(item.selectedOptions).map(([k, v]) => (
                        <span key={k} style={{ marginRight: 12 }}>{`${k}: ${v}`}</span>
                      ))}
                    </div>
                  )}

                  {/* Variant info (optional) */}
                  {item.selectedVariant?.title && (
                    <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                      {item.selectedVariant.title}
                    </div>
                  )}

                  {/* price (single license) */}
                  <p className="price" style={{ marginTop: 8 }}>{variantPrice.toLocaleString()} đ</p>

                  {/* Quantity locked to 1 */}
                  <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>Số lượng: <strong>1</strong></div>
                </div>

                <button className="remove" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="cart-right">
          <div className="summary">
            <h3>Thanh toán</h3>

            <div className="input-group">
              <label>Mã ưu đãi</label>
              <div className="input-row">
                <input type="text" placeholder="Nhập mã" value={promo} onChange={(e) => setPromo(e.target.value)} />
                <button className="apply-btn" onClick={applyPromo}>Áp dụng</button>
              </div>
            </div>

            <div className="input-group">
              <label>Liên hệ</label>
              <div className="input-row phone">
                <span className="prefix">+84</span>
                <input type="tel" placeholder="Nhập số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-row">
                <input type="text" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="line">
              <span>Tổng tiền</span>
              <strong>{total.toLocaleString()} đ</strong>
            </div>

            <div className="pay-alt">
              <button className="qr-btn vnpay-btn" onClick={payVnpay}>
                <img src={vnpayLogo} alt="VNPay" className="pay-logo" /> Thanh toán với VNPay QR
              </button>
              <button className="qr-btn momo-btn" onClick={payMomo}>
                <img src={momoLogo} alt="MoMo" className="pay-logo" /> Thanh toán với MoMo QR
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
    </div>
  );
}
