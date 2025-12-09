import React from "react";
import "./FooterIntro.css";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import Logo from "../../assets/images/DigitexLogoWhite.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Logo + Social */}
        <div className="footer-logo-social">
          <img src={Logo} alt="Demo Shop Logo" className="footer-logo" />
          <div className="footer-social">
            <a
              href="https://www.facebook.com/amitgroup.vn"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@AmitGROUPmkt"
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Giới thiệu */}
        <div className="footer-intro">
          <h4>Giới thiệu</h4>
          <p>
            Digitech Shop – Địa chỉ uy tín chuyên cung cấp phần mềm bản quyền
            chính hãng với giá tốt. Chúng tôi cam kết mang đến sản phẩm chất
            lượng cao, đa dạng từ các lĩnh vực như AI, thiết kế, văn phòng, bảo
            mật và giải trí, cùng dịch vụ hỗ trợ khách hàng tận tâm 24/7.
          </p>

          <ul>
            <li>
              📞{" "}
              <a href="/support" className="footer-contact-link">
                0911 000 038
              </a>
            </li>

            <li>✉️ info@digitechshop.com</li>

            <li>
              📍{" "}
              <a
                href="https://www.google.com/maps/search/?api=1&query=7+Đường+số+7C,+An+Phú+An+Khánh,+Thủ+Đức,+HCM"
                target="_blank"
                rel="noreferrer"
                className="footer-contact-link"
              >
                7 Đường số 7C, Khu đô thị An Phú An Khánh, Thủ Đức, HCM 71106
              </a>
            </li>

            <li>⏰ 8:00 – 18:00</li>
          </ul>
        </div>

        {/* Thông tin chung */}
        <div className="footer-links">
          <h4>Thông tin chung</h4>
          <ul>
            <li>
              <a href="/about">Giới thiệu</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
            <li>
              <a href="/guide">Hướng dẫn</a>
            </li>
            <li>
              <a href="/policy">Chính sách</a>
            </li>
            <li>
              <a href="/news">Tin tức</a>
            </li>
            <li>
              <a href="/faqs">FAQs</a>
            </li>
          </ul>
        </div>

        {/* Sản phẩm */}
        <div className="footer-products">
          <h4>Sản phẩm</h4>
          <ul>
            <li>
              <a href="/products/prod_01K8MB1QGG41PGF6TW6EMV8WE5">
                Tài khoản ChatGPT Plus
              </a>
            </li>

            <li>
              <a href="/products/prod_01K73GH4C095RABRJYHGY4M4N3">
                Tài khoản Netflix Giá Rẻ
              </a>
            </li>

            <li>
              <a href="/products/prod_01K72DZQB15YCF1YSQTD3WPYF3">
                Tài khoản Spotify Premium
              </a>
            </li>

            <li>
              <a href="/products/prod_01K7GNFM02ZS77DZHV576Y9KF3">
                Key Bản Quyền Office
              </a>
            </li>

            <li>
              <a href="/products/prod_01K72CCA3STC0P3NRNQBZHP10Z">
                Tài khoản Discord Nitro
              </a>
            </li>

            <li>
              <a href="/products/prod_01K8M9VB03HV2BMA103T60N0EH">
                Tài khoản Adobe CC
              </a>
            </li>
          </ul>
        </div>

        {/* Box hỗ trợ 24/7 (Gộp thành 1 nút) */}
        <div className="footer-support">
          <h4 className="support-title">Hỗ trợ 24/7</h4>

          {/* Nút hỗ trợ duy nhất */}
          <a href="/support" className="support-btn single">
            <span className="support-icon phone">📞</span>
            <div className="support-text">
              <span className="support-label">Liên hệ hỗ trợ</span>
              <span className="support-value">Gọi / Báo cáo sự cố</span>
            </div>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Digitech Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
