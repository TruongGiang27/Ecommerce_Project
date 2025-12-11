import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import "./Cart.css";
import vnpayLogo from "../../images/vnpay-logo.png";
import momoLogo from "../../images/momo-logo.png";
// import { processCheckout } from "../../services/order";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllVariants,
  setManyVariants,
} from "../../redux/slices/variantSlice";
import {
  resetCustomerInfo,
  setCustomerInfo,
} from "../../redux/slices/customerInfoSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [promoTemp, setPromoTemp] = useState("");
  const [promo, setPromo] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState([]); // checked items
  const [qrCode, setQrCode] = useState(null);

  const [isVNPayModalOpen, setIsVNPayModalOpen] = useState(false);
  const [isMomoModalOpen, setIsMomoModalOpen] = useState(false);

  const paymentUrl = process.env.REACT_APP_PAYMENT_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const promoText = promo ? (
    <>
      mã ưu đãi: <strong>{promo}</strong>
    </>
  ) : (
    "không mã ưu đãi"
  );

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(clearAllVariants());
    dispatch(resetCustomerInfo());

    console.log("Đã clear");
  }, []);

  // sync selected default none
  useEffect(() => {
    setSelected([]);
  }, [cart]);

  const formatDataForCart = (items) => {
    return items.map((item) => {
      // Tách chuỗi dựa vào ký tự '#'
      const [productId, variantId] = item.split("#");

      return {
        product_id: productId,
        variant_id: variantId,
      };
    });
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyPromo = (promotion) => {
    const upperCode = promotion.toUpperCase();

    setPromo(upperCode);

    alert(`Mã ưu đãi: ${upperCode || "Chưa nhập"}`);
  };

  const validateVNPayOrder = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      navigate("/login");
      return false;
    }

    if (!email || !firstName || !lastName || !address || !city || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi thanh toán.");
      return false;
    }

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return false;
    }

    setIsVNPayModalOpen(true);
  };

  const validateMomoOrder = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      navigate("/login");
      return false;
    }

    if (!email || !firstName || !lastName || !address || !city || !phone) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi thanh toán.");
      return false;
    }

    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return false;
    }

    setIsMomoModalOpen(true);
  };

  const saveToRedux = () => {
    const newSelected = formatDataForCart(selected);

    // --- 1. Xử lý Variants ---
    if (newSelected.length > 0) {
      dispatch(setManyVariants(newSelected));
      console.log(
        "Đã lưu variants vào Redux thành công với data: ",
        newSelected
      );
    }

    // --- 2. Xử lý Customer Info ---
    dispatch(
      setCustomerInfo({
        email: email,
        address: {
          first_name: firstName,
          last_name: lastName,
          address_1: address,
          city: city,
          phone: phone,
          country_code: "vn",
          postal_code: "700000",
        },
        promoCodes: promo ? [promo] : [],
      })
    );
    console.log(
      "Đã lưu customer info vào Redux thành công với data: ",
      email,
      firstName,
      lastName,
      address,
      city,
      phone,
      promo
    );
  };

  const payVnpay = async () => {
    const res = await fetch(`${paymentUrl}/create_payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();
    if (data?.data) window.location.href = data.data;
  };

  const payMomo = async () => {
    const res = await fetch(`${paymentUrl}/create-momo-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        orderInfo: "Thanh toán đơn hàng",
      }),
    });

    const data = await res.json();
    if (data?.payUrl) window.location.href = data.payUrl;
  };

  // total = sum of prices of checked items (each item quantity = 1)
  const total = cart.reduce((sum, item) => {
    if (!selected.includes(item.id)) return sum;
    const variantPrice =
      item.selectedVariant?.price || (item?.selectedVariant?.price ?? 0);
    // variantPrice expected in VND unit (299000 etc)
    return sum + (variantPrice || 0);
  }, 0);

  if (!cart.length) {
    return (
      <div className="cart-page">
        <div className="cart-wapper">
          <p className="cart-empty">🛒 Giỏ hàng của bạn đang trống</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    {/* title already contains friendly label from ProductDetail */}
                    <h3>{item.title}</h3>

                    {/* Show readable selected options (optionTitle: value) */}
                    {item.selectedOptions &&
                      Object.keys(item.selectedOptions).length > 0 && (
                        <div
                          style={{ fontSize: 13, color: "#666", marginTop: 6 }}
                        >
                          {Object.entries(item.selectedOptions).map(
                            ([k, v]) => (
                              <span
                                key={k}
                                style={{ marginRight: 12 }}
                              >{`${k}: ${v}`}</span>
                            )
                          )}
                        </div>
                      )}

                    {/* Variant info (optional) */}
                    {item.selectedVariant?.title && (
                      <div
                        style={{ fontSize: 13, color: "#555", marginTop: 6 }}
                      >
                        {item.selectedVariant.title}
                      </div>
                    )}

                    {/* price (single license) */}
                    <p className="price" style={{ marginTop: 8 }}>
                      {variantPrice.toLocaleString()} đ
                    </p>

                    {/* Quantity locked to 1 */}
                    <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
                      Số lượng: <strong>1</strong>
                    </div>
                  </div>

                  <button
                    className="remove"
                    onClick={() => removeFromCart(item.id)}
                  >
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

              {/* Mã ưu đãi */}
              <div className="input-group">
                <label>Mã ưu đãi</label>
                <div className="input-row">
                  <input
                    type="text"
                    placeholder="Nhập mã"
                    value={promoTemp}
                    onChange={(e) => setPromoTemp(e.target.value)}
                  />
                  <button
                    className="apply-btn"
                    onClick={() => applyPromo(promoTemp)}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Thông tin */}
              <div>
                <h3>Thông tin</h3>

                <div className="input-info-group">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-info-feild"
                  />
                </div>

                <div className="input-info-group">
                  <label>Họ</label>
                  <input
                    type="text"
                    placeholder="Nhập họ của bạn"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-info-feild"
                  />
                </div>

                <div className="input-info-group">
                  <label>Tên</label>
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-info-feild"
                  />
                </div>

                <div className="input-info-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ của bạn"
                    value={address}
                    onChange={(e) => setAdress(e.target.value)}
                    className="input-info-feild"
                  />
                </div>

                <div className="input-info-group">
                  <label>Thành phố</label>
                  <input
                    type="text"
                    placeholder="Nhập thành phố của bạn"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-info-feild"
                  />
                </div>

                <div className="input-info-group">
                  <label>Sđt</label>
                  <div className="input-info-phone">
                    <span className="input-info-prefix">+84</span>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-info-phone-feild"
                    />
                  </div>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="line">
                <span>Tổng tiền</span>
                <strong>{total.toLocaleString()} đ</strong>
              </div>

              {/* Thanh toán */}
              <div className="pay-alt">
                <button
                  className="qr-btn vnpay-btn"
                  onClick={validateVNPayOrder}
                >
                  <img src={vnpayLogo} alt="VNPay" className="pay-logo" /> Thanh
                  toán với VNPay QR
                </button>
                <button className="qr-btn momo-btn" onClick={validateMomoOrder}>
                  <img src={momoLogo} alt="MoMo" className="pay-logo" /> Thanh
                  toán với MoMo QR
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

      {/* Modal xác nhận thanh toán vnpay */}
      {isVNPayModalOpen && (
        <div className="outside-modal">
          <div className="confirm-modal">
            <h3 className="modal-header">Xác nhận thanh toán bằng VNPay</h3>

            <div className="modal-content">
              <p className="text">
                Bạn đang thực hiện thanh toán cho đơn hàng trị giá:{" "}
                <strong style={{ color: "red", fontWeight: "bold" }}>
                  {total.toLocaleString()} đ
                </strong>
              </p>

              <p className="text">Thông tin ưu đãi: {promoText}</p>

              <p className="text">
                Địa chỉ nhận hàng: {address}, {city}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              {/* Nút Hủy: Chỉ hiện khi KHÔNG processing */}
              <button
                onClick={() => setIsVNPayModalOpen(false)}
                className="cancel-btn"
              >
                Hủy bỏ
              </button>

              {/* Nút OK: Gọi hàm handelBuyNow */}
              <button
                onClick={() => {
                  saveToRedux();
                  payVnpay();
                }}
                className="confirm-btn"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận thanh toán momo */}
      {isMomoModalOpen && (
        <div className="outside-modal">
          <div className="confirm-modal">
            <h3 className="modal-header">Xác nhận thanh toán bằng Momo</h3>

            <div className="modal-content">
              <p className="text">
                Bạn đang thực hiện thanh toán cho đơn hàng trị giá:{" "}
                <strong style={{ color: "red", fontWeight: "bold" }}>
                  {total.toLocaleString()} đ
                </strong>
              </p>

              <p className="text">Thông tin ưu đãi: {promoText}</p>

              <p className="text">
                Địa chỉ nhận hàng: {address}, {city}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              {/* Nút Hủy: Chỉ hiện khi KHÔNG processing */}
              <button
                onClick={() => setIsMomoModalOpen(false)}
                className="cancel-btn"
              >
                Hủy bỏ
              </button>

              {/* Nút OK: Gọi hàm handelBuyNow */}
              <button onClick={payMomo} className="confirm-btn">
                Đồng ý thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
