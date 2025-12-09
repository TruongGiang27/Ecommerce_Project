import React from "react";
import "./News.css";
import ImgAI from "../../assets/images/IconLogo.png";
import ImgAdobeNew from "../../assets/images/new-adobe.png";
import ImgAdobe from "../../assets/images/adobe.png";

const news = [
  {
    id: 1,
    day: "01",
    month: "Tháng 12",
    title:
      "Top các trợ lý ảo AI thông minh dự kiến sẽ hỗ trợ đắc lực cho công việc năm 2026",
    tag: "Tin nổi bật",
    image: ImgAI,
    link: "/news/ai-assistant-2026",
  },
  {
    id: 2,
    day: "24",
    month: "Tháng 10",
    title:
      "Adobe Bản Quyền Chính Hãng Tại HCM: Ưu Đãi Sốc Giá Tốt Nhất 2025",
    tag: "Tin nổi bật",
    image: ImgAdobeNew,
    link: "/news/adobe-official",
  },
  {
    id: 3,
    day: "24",
    month: "Tháng 10",
    title:
      "Adobe Bản Quyền Giá Rẻ Nhất HCM: Ưu Đãi Sốc Cho Designer 2025!",
    tag: "Tin nổi bật",
    image: ImgAdobe,
    link: "/news/adobe-cheap",
  },
];

export default function News() {
  return (
    <div className="news-container">
      <h2 className="news-title">Tin tức</h2>

      <div className="news-grid">
        {news.map((n) => (
          <div key={n.id} className="news-card">
            <div className="news-date">
              <span>{n.day}</span>
              <small>{n.month}</small>
            </div>

            <img src={n.image} alt={n.title} className="news-img" />

            <div className="news-content">
              <span className="news-tag">{n.tag}</span>
              <h3>{n.title}</h3>

              <a href={n.link} className="news-link">
                Xem chi tiết →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
