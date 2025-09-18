import React from "react";
import "../About/about.css";

export default function About() {
  return (
    <div className="about-container">
      <section className="hero-section">
        <h1>Về Shop Software</h1>
        <p className="subtitle">
          Nền tảng phân phối phần mềm bản quyền hàng đầu Việt Nam
        </p>
      </section>

      <section className="content-section">
        <div className="mission-vision">
          <h2>Sứ mệnh của chúng tôi</h2>
          <p>
            Shop Software cam kết mang đến cho khách hàng những sản phẩm phần
            mềm chất lượng với giá cả hợp lý, đảm bảo 100% tính bản quyền và hỗ
            trợ kỹ thuật chuyên nghiệp.
          </p>
        </div>

        <div className="features">
          <h2>Điểm nổi bật</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Sản phẩm chính hãng</h3>
              <p>Phần mềm được cung cấp trực tiếp từ nhà phát hành</p>
            </div>
            <div className="feature-item">
              <h3>Giá cả cạnh tranh</h3>
              <p>Cam kết giá tốt nhất thị trường cho phần mềm bản quyền</p>
            </div>
            <div className="feature-item">
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ khi bạn cần</p>
            </div>
            <div className="feature-item">
              <h3>Bảo hành dài hạn</h3>
              <p>
                Chính sách bảo hành và cập nhật trong suốt thời gian sử dụng
              </p>
            </div>
          </div>
        </div>

        <div className="categories">
          <h2>Danh mục sản phẩm</h2>
          <div className="categories-list">
            <div className="category">
              <h3>Phần mềm thiết kế</h3>
              <p>Adobe, Autodesk, Sketch, Figma...</p>
            </div>
            <div className="category">
              <h3>Phần mềm văn phòng</h3>
              <p>Microsoft Office, Google Workspace...</p>
            </div>
            <div className="category">
              <h3>Phần mềm lập trình</h3>
              <p>Visual Studio, JetBrains, Sublime Text...</p>
            </div>
          </div>
        </div>

        <div className="contact-info">
          <h2>Liên hệ với chúng tôi</h2>
          <p>Email: support@shopsoftware.com</p>
          <p>Hotline: 1900 xxxx</p>
          <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
        </div>
      </section>
    </div>
  );
}
