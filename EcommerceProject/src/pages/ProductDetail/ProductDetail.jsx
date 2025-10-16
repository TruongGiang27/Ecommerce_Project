import { useParams } from "react-router-dom";
import { useState, useContext, useEffect, useMemo } from "react";
import { CartContext } from "../../context/CartContext";
import { FaCheckCircle } from "react-icons/fa";
import "./productDetail.css";
import { fetchProductById } from "../../services/api"; // Đảm bảo hàm này đã được sửa

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  // ✅ STATE MỚI: Theo dõi Variant (Gói dịch vụ) đang được chọn
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);

        // ✅ Tự động chọn Variant đầu tiên làm mặc định
        if (data?.variants?.length > 0) {
          setSelectedVariantId(data.variants[0].id);
        }
      } catch (err) {
        // Log lỗi chi tiết
        console.error("Lỗi khi tải sản phẩm:", err);
        setError(err.message || "Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // --- LOGIC HỖ TRỢ ---

  // Hàm tiện ích để định dạng tiền tệ từ cents/smallest unit
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || typeof amount !== "number")
      return "Liên hệ";
    // Medusa V2: Giá trị là số nguyên (cents), cần chia 100
    return (amount / 100).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Lấy ra variant đang được chọn
  const selectedVariant = useMemo(() => {
    if (!product || !selectedVariantId) return null;
    return product.variants.find((v) => v.id === selectedVariantId);
  }, [product, selectedVariantId]);

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedVariantId) {
      alert("Vui lòng chọn một gói dịch vụ.");
      return;
    }
    // ✅ Gửi Variant ID và số lượng (1) vào giỏ hàng
    addToCart(selectedVariantId, 1);
  };

  // Lấy features từ metadata an toàn
  const features = product?.metadata?.features || [];
  // Lấy giá mặc định (của variant đang được chọn, hoặc variant đầu tiên)
  const displayPrice =
    selectedVariant?.calculated_price ||
    product?.variants?.[0]?.calculated_price;

  // --- TRẠNG THÁI UI ---
  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Có lỗi xảy ra: {error}</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-gallery">
          <img
            // Fallback nếu thumbnail không có
            src={product.thumbnail || product.images?.[0]?.url}
            alt={product.title}
            className="main-image"
          />

          {/* Subscription Features (Giữ nguyên) */}
          {/* ... */}

          {/* Supported Devices (Giữ nguyên) */}
          {/* ... */}
        </div>

        <div className="product-info">
          {/* Product Header */}
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">
              {/* ✅ Hiển thị giá của Variant đã chọn */}
              {formatPrice(displayPrice)}
            </div>
          </div>

          {/* ✅ SỬA: Subscription Plans dựa trên Product Variants */}
          <div className="subscription-plans">
            <h3>Gói dịch vụ</h3>
            <div className="plans-grid">
              {/* Lặp qua tất cả các Variants (Gói dịch vụ) */}
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`plan-card ${
                    variant.id === selectedVariantId ? "selected" : ""
                    // ✅ ĐÃ SỬA: Dùng (variant.title || '').includes('6')
                    // Thay thế null/undefined bằng chuỗi rỗng ('') để gọi includes() an toàn
                  } ${(variant.title || "").includes("6") ? "featured" : ""}`}
                  onClick={() => setSelectedVariantId(variant.id)} // Cập nhật Variant được chọn
                >
                  {/* Sử dụng title của Variant (ví dụ: "1 Tháng") */}
                  <h4>{variant.title}</h4>
                  <div className="plan-price">
                    {formatPrice(variant.calculated_price)}
                  </div>
                  {/* Phần Tiết kiệm/Best Value có thể được thêm qua Product Metadata nếu cần */}

                  <button
                    className={`btn ${
                      variant.id === selectedVariantId
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {variant.id === selectedVariantId ? "Đã chọn" : "Chọn gói"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nút Thêm vào giỏ hàng chính */}
          <button
            className="btn btn-lg btn-success mt-4 w-100"
            onClick={handleAddToCart}
            disabled={!selectedVariantId}
          >
            Thêm gói dịch vụ đã chọn vào giỏ hàng
          </button>

          {/* Product Details Tabs */}
          <div className="product-tabs">
            {/* ... (Tabs Header giữ nguyên) ... */}

            <div className="tab-content">
              {activeTab === "description" && (
                <div className="description-content">
                  <h3>Giới thiệu về {product.title}</h3>
                  <div className="product-description">
                    {product.description}
                  </div>
                  {/* ✅ SỬA: Truy cập Metadata an toàn và chỉ hiển thị khi có dữ liệu */}
                  {features.length > 0 && (
                    <div className="features-list">
                      {features.map((feature, index) => (
                        <li key={index}>
                          <FaCheckCircle className="feature-icon" />
                          {feature}
                        </li>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ... (Các tab Guide và Policy giữ nguyên) ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
