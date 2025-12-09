import React from "react";
import { Link } from "react-router-dom";
import "./Guide.css";

// Images
import ImgCanva from "../../assets/images/canva-pro.png";
import ImgCountif from "../../assets/images/IconLogo.png";
import ImgQuizlet from "../../assets/images/quizlet.png";

// Banner quảng cáo
import GuideBanner from "../../assets/images/guide-banner.png";

const guides = [
  {
    id: 1,
    day: "23",
    month: "Tháng 10",
    title: "Mua tài khoản Canva Pro chính chủ giá tốt tại Digitech Shop",
    link: "/guide/canva-pro",
    image: ImgCanva,
  },
  {
    id: 2,
    day: "30",
    month: "Tháng 9",
    title: "Hướng dẫn dùng hàm COUNTIF trong Google Sheet chi tiết",
    link: "/guide/countif",
    image: ImgCountif,
  },
  {
    id: 3,
    day: "29",
    month: "Tháng 9",
    title: "Hướng Dẫn Tạo Quiz Trên Quizlet – Cách Tạo Đề Kiểm Tra Hiệu Quả",
    link: "/guide/quizlet",
    image: ImgQuizlet,
  },
];

export default function Guide() {
  return (
    <>
      {/* Main container */}
      <div className="guide-container">
        <h2 className="guide-title">Hướng dẫn</h2>

        <div className="guide-grid">
          {guides.map((g) => (
            <div key={g.id} className="guide-card">
              <div className="guide-date">
                <span>{g.day}</span>
                <small>{g.month}</small>
              </div>

              <img src={g.image} className="guide-img" alt={g.title} />

              <div className="guide-content">
                <span className="guide-tag">Hướng dẫn</span>
                <h3>{g.title}</h3>

                <Link to={g.link} className="guide-link">
                  Xem chi tiết →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ FULL WIDTH BANNER */}
      <div className="guide-banner-full">
        <Link to="/products">
          <img
            src={GuideBanner}
            alt="DigiTech Shop Banner"
            className="guide-banner-img"
          />
        </Link>
      </div>
    </>
  );
}
