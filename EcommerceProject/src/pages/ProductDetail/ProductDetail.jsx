import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../../context/CartContext";
import { SiZalo } from "react-icons/si"; // Icon Zalo
import { FaEnvelope } from "react-icons/fa"; // Icon Gmail

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  // State để lưu tài khoản cần nâng cấp
  const [upgradeAccount, setUpgradeAccount] = useState("");
  const { addToCart, cart } = useCart();
  const [activeTab, setActiveTab] = useState("description");
  
  // 🔥 1. Lấy URL từ biến môi trường
  const BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL;
  const REGION = process.env.REACT_APP_MEDUSA_REGION_ID || "reg_01K73N9QAJJ6DVF7FGKAKCJQG0";

  // 🔥 2. Hàm xử lý link ảnh (Fix lỗi localhost)
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.includes("localhost:9000")) {
      return url.replace("http://localhost:9000", BACKEND_URL);
    }
    return url;
  };

  useEffect(() => {
    fetch(
      `${BACKEND_URL}/store/products/${id}?region_id=${REGION}`,
      {
        headers: {
          "x-publishable-api-key":
             process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY || "pk_d4bf2faebacb69611013a1fd3c32bb8f76ab55d06f2068d92b0efd01a377ecfc",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        // Giữ behavior cũ: auto chọn variant đầu tiên để hiện giá
        if (data.product?.variants?.length) {
          setSelectedVariant(data.product.variants[0]);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy chi tiết sản phẩm:", err));
  }, [id, BACKEND_URL]);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  const getVariantPrice = (variant) => {
    if (!variant) return 0;
    return (
      variant?.calculated_price?.calculated_amount ||
      variant?.prices?.[0]?.amount ||
      0
    );
  };

  const displayPriceFromVariant = (variant) => {
    const raw = getVariantPrice(variant);
    return raw > 0 ? `${raw.toLocaleString("vi-VN")} ₫` : "Liên hệ";
  };

  const friendlyLabel = Object.entries(selectedOptions)
    .map(([optId, val]) => {
      const opt = product.options.find((o) => o.id === optId);
      return `${opt?.title || optId}: ${val}`;
    })
    .join(" — ");

  const handleOptionSelect = (optionId, value) => {
    const newSelected = { ...selectedOptions, [optionId]: value };
    setSelectedOptions(newSelected);

    // Tìm variant trùng khớp với tất cả option đã chọn
    const matched = product.variants.find((variant) =>
      variant.options.every((opt) =>
        newSelected[opt.option_id]
          ? newSelected[opt.option_id] === opt.value
          : true
      )
    );

    setSelectedVariant(matched || null);
  };

  const handleReset = () => {
    setSelectedOptions({});
    // Khi reset, quay về variant đầu để hiển thị giá
    setSelectedVariant(product.variants[0] || null);
    setUpgradeAccount(""); // Reset cả tài khoản khi chọn lại
  };

  // Logic để xác định xem có hiển thị ô nhập tài khoản không
  // Kiểm tra xem có bất kỳ giá trị option nào được chọn có chứa chữ "chính chủ" không
  const isOfficialUpgrade = Object.values(selectedOptions).some((value) =>
    value.toLowerCase().includes("chính chủ")
  );

  const shownPrice = displayPriceFromVariant(selectedVariant);
  const isContactOnly = shownPrice === "Liên hệ";

  // 🔎 Sản phẩm có option không
  const hasOptions = product.options && product.options.length > 0;

  // ✅ Đã chọn đầy đủ tất cả option chưa
  const hasSelectedAllOptions = hasOptions
    ? product.options.every((opt) => selectedOptions[opt.id])
    : true;

  // 👉 Chỉ cho thanh toán nếu:
  // - Không phải hàng "Liên hệ"
  // - Và (không có option) HOẶC (đã chọn đủ option & có variant match)
  const canCheckout =
    !isContactOnly &&
    (!hasOptions || (hasSelectedAllOptions && selectedVariant));

  const handleAddToCart = () => {
    // Không cho thêm nếu chưa chọn đủ
    if (!canCheckout) return;

    // Thêm validation tài khoản nâng cấp
    if (isOfficialUpgrade && !upgradeAccount.trim()) {
      alert("Vui lòng nhập tài khoản cần nâng cấp!");
      return;
    }

    const variant = selectedVariant || product.variants?.[0] || null;
    const payloadId = `${product.id}#${variant?.id || "default"}`;
    const exists = cart.some((c) => c.id === payloadId);
    if (exists) {
      alert(
        "Sản phẩm này (phiên bản) đã có trong giỏ — mỗi mã chỉ được mua 1 lần."
      );
      return;
    }

    addToCart({
      id: payloadId,
      productId: product.id,
      title: product.title + (friendlyLabel ? " — " + friendlyLabel : ""),
      thumbnail: product.thumbnail,
      quantity: 1,
      // Thêm tài khoản nâng cấp vào giỏ hàng
      upgradeAccount: isOfficialUpgrade ? upgradeAccount : null,
      selectedVariant: {
        id: variant?.id,
        title: variant?.title,
        price: getVariantPrice(variant),
      },
    });
  };

  const handleBuyNow = () => {
    // Không cho thanh toán nếu chưa chọn đủ
    if (!canCheckout) return;

    // Thêm validation
    if (isOfficialUpgrade && !upgradeAccount.trim()) {
      alert("Vui lòng nhập tài khoản cần nâng cấp!");
      return;
    }

    const variant = selectedVariant || product.variants?.[0] || null;
    const payloadId = `${product.id}#${variant?.id || "default"}`;
    const exists = cart.some((c) => c.id === payloadId);
    if (!exists) {
      addToCart({
        id: payloadId,
        productId: product.id,
        title: product.title + (friendlyLabel ? " — " + friendlyLabel : ""),
        thumbnail: product.thumbnail,
        quantity: 1,
        // Thêm tài khoản nâng cấp vào giỏ hàng
        upgradeAccount: isOfficialUpgrade ? upgradeAccount : null,
        selectedVariant: {
          id: variant?.id,
          title: variant?.title,
          price: getVariantPrice(variant),
        },
      });
    }
    navigate("/cart");
  };

  return (
    <div className="product-detail-container">
      <div className="product-container">
        <div className="product-left">
          {/* 🔥 3. Áp dụng getImageUrl cho ảnh chính */}
          <img
            src={getImageUrl(selectedImage || product.thumbnail)}
            alt={product.title}
            className="main-image"
          />
          <div className="thumbnail-list">
            {product.images?.map((img, index) => (
              /* 🔥 4. Áp dụng getImageUrl cho danh sách ảnh nhỏ */
              <img
                key={index}
                src={getImageUrl(img.url)}
                alt=""
                className={selectedImage === img.url ? "active" : ""}
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        <div className="product-right">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-status">Tình trạng: Còn hàng</p>
          <p className={`price ${isContactOnly ? "contact-price" : ""}`}>
            {shownPrice}
          </p>

          {!isContactOnly && (
            <>
              <h3 className="option-title">Chọn sản phẩm</h3>
              {product.options?.map((opt) => (
                <div key={opt.id} className="option-group">
                  <label>{opt.title}</label>
                  <div className="option-list">
                    {opt.values.map((v) => {
                      const isActive = selectedOptions[opt.id] === v.value;
                      const wouldBe = { ...selectedOptions, [opt.id]: v.value };
                      const available = product.variants.some((variant) =>
                        variant.options.every((op) =>
                          wouldBe[op.option_id]
                            ? wouldBe[op.option_id] === op.value
                            : true
                        )
                      );

                      return (
                        <div
                          key={v.id}
                          className={`option-item ${
                            isActive ? "active" : ""
                          } ${!available ? "disabled" : ""}`}
                          onClick={() =>
                            available && handleOptionSelect(opt.id, v.value)
                          }
                        >
                          {v.value}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {!isContactOnly && (
            <>
              <p className="reset" onClick={handleReset}>
                Chọn lại
              </p>
              <div style={{ margin: "12px 0", color: "#666" }}>
                Số lượng: <strong>1</strong> (mỗi mã chỉ mua 1 lần)
              </div>

              {/* Khối JSX cho ô nhập tài khoản */}
              {isOfficialUpgrade && (
                <div className="upgrade-account-input-group">
                  <label htmlFor="upgradeAccountInput">
                    Nhập tài khoản cần nâng cấp (không phải tài khoản đăng
                    nhập Woku Shop)
                  </label>
                  <input
                    id="upgradeAccountInput"
                    type="text"
                    className="upgrade-account-input"
                    placeholder="Nhập email / tài khoản của bạn"
                    value={upgradeAccount}
                    onChange={(e) => setUpgradeAccount(e.target.value)}
                  />
                </div>
              )}

              <div className="btn-group">
                <button
                  className="btn-buy"
                  onClick={handleBuyNow}
                  disabled={!canCheckout}
                >
                  Mua ngay
                </button>
                <button
                  className="btn-add"
                  onClick={handleAddToCart}
                  disabled={!canCheckout}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </>
          )}

          {isContactOnly && (
            <div className="contact-section">
              <div className="contact-box">
                <div className="contact-item">
                  <div className="contact-icon">
                    <SiZalo />
                  </div>
                  <div className="contact-info">
                    <p className="contact-name">Zalo hỗ trợ</p>
                    <p className="contact-phone">0901 234 567</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-info">
                    <p className="contact-name">Email liên hệ</p>
                    <p className="contact-phone">support@cutieshop.vn</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-header">
          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={activeTab === "policy" ? "active" : ""}
            onClick={() => setActiveTab("policy")}
          >
            Chính sách
          </button>
          <button
            className={activeTab === "review" ? "active" : ""}
            onClick={() => setActiveTab("review")}
          >
            Đánh giá
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div
              className="description-text"
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.6",
                fontSize: "16px",
                color: "#555",
              }}
            >
              {product.description}
            </div>
          )}

          {activeTab === "policy" && (
            <p>
              🛡️ Sản phẩm được bảo hành chính hãng 12 tháng. Đổi trả trong vòng
              7 ngày nếu có lỗi do nhà sản xuất.
            </p>
          )}
          {activeTab === "review" && (
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
          )}
        </div>
      </div>
    </div>
  );
}