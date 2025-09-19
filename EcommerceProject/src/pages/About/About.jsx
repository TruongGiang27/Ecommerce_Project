import React from "react";
import { FaShieldAlt, FaHeadset, FaTags, FaSyncAlt } from "react-icons/fa";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="overlay">
          <h1>Về Shop Software</h1>
          <p>
            Nền tảng phân phối phần mềm bản quyền hàng đầu Việt Nam – Uy tín,
            chuyên nghiệp và tận tâm.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission container">
        <h2>Sứ mệnh & Tầm nhìn</h2>
        <p>
          Chúng tôi cam kết mang đến cho khách hàng các giải pháp phần mềm chính
          hãng với chi phí hợp lý, đảm bảo tính bản quyền 100% và dịch vụ hỗ trợ
          24/7. Tầm nhìn của Shop Software là trở thành lựa chọn số 1 tại Việt
          Nam trong lĩnh vực phân phối phần mềm bản quyền.
        </p>
      </section>

      {/* Core Values */}
      <section className="about-values container">
        <h2>Giá trị cốt lõi</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaShieldAlt size={40} color="#007bff" />
            <h3>Uy tín</h3>
            <p>Sản phẩm chính hãng, nguồn gốc rõ ràng từ nhà phát hành.</p>
          </div>
          <div className="value-card">
            <FaHeadset size={40} color="#28a745" />
            <h3>Hỗ trợ 24/7</h3>
            <p>Đội ngũ kỹ thuật sẵn sàng đồng hành cùng khách hàng.</p>
          </div>
          <div className="value-card">
            <FaTags size={40} color="#ffc107" />
            <h3>Giá cả hợp lý</h3>
            <p>Cam kết giá cạnh tranh, ưu đãi linh hoạt.</p>
          </div>
          <div className="value-card">
            <FaSyncAlt size={40} color="#17a2b8" />
            <h3>Bảo hành & Cập nhật</h3>
            <p>
              Chính sách bảo hành minh bạch, cập nhật phần mềm liên tục.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline / Journey */}
      <section className="about-timeline container">
        <h2>Hành trình phát triển</h2>
        <ul className="timeline">
          <li>
            <span>2018</span> - Thành lập Shop Software.
          </li>
          <li>
            <span>2020</span> - Hợp tác với nhiều nhà phát hành lớn: Microsoft,
            Adobe, JetBrains...
          </li>
          <li>
            <span>2022</span> - Hơn 50,000 khách hàng tin tưởng sử dụng.
          </li>
          <li>
            <span>2024</span> - Ra mắt hệ thống phân phối trực tuyến toàn quốc.
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h2>Bạn đã sẵn sàng trải nghiệm?</h2>
        <p>
          Khám phá ngay kho phần mềm bản quyền chính hãng với ưu đãi hấp dẫn.
        </p>
        <a href="/products" className="cta-btn">
          Khám phá sản phẩm
        </a>
      </section>
    </div>
  );
}
