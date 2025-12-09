import React from "react";
import "./HeroLanding.css";

import NetflixLogo from "../../assets/images/netflix2.png";
import AdobeLogo from "../../assets/images/adobe-color.png";
import DuolingoLogo from "../../assets/images/duolingo-logo.png";
import WindowsLogo from "../../assets/images/win.png";
import OfficeLogo from "../../assets/images/microsoft_365.png";
import KasperskyLogo from "../../assets/images/kaspersky.png";

export default function HeroLanding() {
  return (
    <section className="hero-signup">
      <div className="hero-floating-layer" aria-hidden="true">
        <div className="hero-floating-card card-1">
          <img src={OfficeLogo} alt="Office" />
        </div>

        <div className="hero-floating-card card-2">
          <img src={NetflixLogo} alt="Netflix" />
        </div>

        <div className="hero-floating-card card-3">
          <img src={AdobeLogo} alt="Adobe" />
        </div>

        <div className="hero-floating-card card-4">
          <img src={DuolingoLogo} alt="Duolingo" />
        </div>

        <div className="hero-floating-card card-5">
          <img src={WindowsLogo} alt="Windows" />
        </div>
      </div>

      <div className="hero-floating-card card-6">
        <img src={KasperskyLogo} alt="Kaspersky" />
      </div>

      <div className="hero-inner">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          3.000+ khách hàng tin tưởng
        </div>

        <h2 className="hero-title">
          <span className="hero-title-gradient">Mua tài Khoản Chính Chủ, </span>
          <span className="hero-title-gradient">Key bản Quyền Giá Tốt </span>
          <span className="hero-title-gradient">Tại Digitech Shop</span>
        </h2>

        <p className="hero-subtitle">
          Trải nghiệm mua sắm tiện lợi với tài khoản và key bản quyền chính
          hãng tại Digitech Shop. Cam kết giá tốt nhất, hỗ trợ kỹ thuật và dịch
          vụ khách hàng chu đáo suốt quá trình sử dụng.
        </p>

        <a href="/register" className="hero-cta">
          <span>Đăng ký tài khoản</span>
          <span className="hero-cta-arrow">➜</span>
        </a>
      </div>
    </section>
  );
}
