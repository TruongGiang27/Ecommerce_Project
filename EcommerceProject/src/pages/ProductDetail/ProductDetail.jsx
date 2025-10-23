import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(
      `http://localhost:9000/store/products/${id}?region_id=reg_01K73N9QAJJ6DVF7FGKAKCJQG0`,
      {
        headers: {
          "x-publishable-api-key":
            process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setSelectedVariant(data.product.variants[0]);
      })
      .catch((err) => console.error("Lỗi khi lấy chi tiết sản phẩm:", err));
  }, [id]);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  // Tính giá hiển thị
  const price =
    selectedVariant?.calculated_price?.calculated_amount ||
    selectedVariant?.prices?.[0]?.amount ||
    0;

  // Khi chọn option
  const handleOptionSelect = (optionId, value) => {
    const newSelected = { ...selectedOptions, [optionId]: value };
    setSelectedOptions(newSelected);

    // Tìm variant hợp lệ với các option đã chọn
    const matched = product.variants.find((variant) =>
      variant.options.every(
        (opt) =>
          !newSelected[opt.option_id] ||
          newSelected[opt.option_id] === opt.value
      )
    );
    if (matched) setSelectedVariant(matched);
  };

  // Check nếu 1 option có hợp lệ theo lựa chọn hiện tại không
  const isOptionAvailable = (optionId, value) => {
    const newSelected = { ...selectedOptions, [optionId]: value };

    // Có ít nhất 1 variant khớp với tổ hợp này thì còn khả dụng
    return product.variants.some((variant) =>
      variant.options.every(
        (opt) =>
          !newSelected[opt.option_id] ||
          newSelected[opt.option_id] === opt.value
      )
    );
  };

  const handleReset = () => {
    setSelectedOptions({});
    setSelectedVariant(product.variants[0]);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedOptions });
  };

  return (
    <div className="product-detail-container">
      <div className="product-container">
        <div className="product-left">
          <img
            src={selectedImage || product.thumbnail}
            alt={product.title}
            className="main-image"
          />
          <div className="thumbnail-list">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
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

          <p className="price">
            {price > 0 ? `${price.toLocaleString()} ₫` : "Liên hệ"}
          </p>

          <h3 className="option-title">Chọn sản phẩm</h3>
          {product.options?.map((opt) => (
            <div key={opt.id} className="option-group">
              <label>{opt.title}</label>
              <div className="option-list">
                {opt.values.map((v, idx) => {
                  const isActive = selectedOptions[opt.id] === v.value;
                  const isAvailable = isOptionAvailable(opt.id, v.value);

                  return (
                    <div
                      key={idx}
                      className={`option-item ${isActive ? "active" : ""} ${
                        !isAvailable ? "disabled" : ""
                      }`}
                      onClick={() =>
                        isAvailable && handleOptionSelect(opt.id, v.value)
                      }
                    >
                      {v.value}
                      {/* {!isAvailable && <span className="x-mark">✕</span>} */}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="reset" onClick={handleReset}>
            Chọn lại
          </p>

          <div className="quantity-box">
            <button
              className="quantity-btn"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>

          <div className="btn-group">
            <button className="btn-buy">Mua ngay</button>
            <button className="btn-add" onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
          </div>
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
            <div className="product-description">{product.description}</div>
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
