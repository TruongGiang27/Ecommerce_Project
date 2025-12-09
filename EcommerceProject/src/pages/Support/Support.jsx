import React from 'react';
import { Link } from 'react-router-dom';
import './Support.css';
// Import logo của shop (nếu có, nếu không bạn có thể bỏ qua hoặc dùng icon placeholder)
// import ShopLogo from '../../assets/shop-logo.png'; 
import ZaloQRImage from '../../assets/images/zalo-qr.png'; // Đảm bảo đường dẫn đúng
import LogoImage from '../../assets/images/DigitexLogoWhite.png'; // Đảm bảo đường dẫn đúng
const Support = () => {
  const shopName = "Digitech Shop"; // Thay đổi tên shop thực tế của bạn
  const shopTagline = "Công nghệ & Thiết bị"; // Slogan hoặc lĩnh vực
  const zaloOAStatus = "Mở cửa"; // Trạng thái OA, có thể là "Đã mở cửa"
  const zaloOALastUpdate = "08:00"; // Thời gian cập nhật trạng thái
  const shopDescription = "Digitech Shop - Công ty cung cấp bản quyền phần mềm giải trí tại Việt Nam"; // Mô tả shop
  const phoneNumber = "0911 000 038"; // Số điện thoại liên hệ

  // Thêm state và hàm sao chép
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!phoneNumber) return;
    try {
      await navigator.clipboard.writeText(phoneNumber);
    } catch {
      // fallback cho trình duyệt cũ
      const el = document.createElement('textarea');
      el.value = phoneNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="zalo-page-container">


      <div className="zalo-content-wrapper">
        {/* Phần thông tin chính của Zalo OA */}
        <div className="main-info-card">
          <div className="shop-header">
            <img
              src={LogoImage} // Thay bằng ShopLogo nếu có, hoặc dùng placeholder khác
              alt="Shop Logo"
              className="shop-logo"
            />
            <div className="shop-details">
              <h1 className="shop-name">{shopName} <span className="verified-icon"></span></h1>
              <p className="shop-tagline">{shopTagline}</p>
            </div>
                {/* Nút chuyển đến ContactForm */}
              <Link
                to="/contact"
                className="follow-button"
                aria-label="Nhắn tin cho cửa hàng"
                title="Liên hệ với chúng tôi"
              >
                <span className="zalo-icon-chat" aria-hidden="true"></span> Liên hệ với chúng tôi
              </Link>
          </div>

          <div className="shop-contact-info">
            <div className="contact-details">
              <h2 className="info-title">Thông tin chi tiết</h2>
              <div className="status">
                <span className="status-icon"></span> {zaloOAStatus} - Mở cửa lúc {zaloOALastUpdate}
              </div>
              <p className="description">{shopDescription}</p>

              <h2 className="phone-title">Số điện thoại liên hệ:</h2>
              <div className="phone-row">
                <p className="phone-number">{phoneNumber}</p>

                {/* Icon copy button: giữ accessibility, đồng thời hiển thị check khi đã sao chép */}
                <button
                  type="button"
                  className={`icon-copy-button${copied ? ' copied' : ''}`}
                  onClick={handleCopy}
                  aria-label={copied ? 'Đã sao chép' : 'Sao chép số điện thoại'}
                  title={copied ? 'Đã sao chép' : 'Sao chép số điện thoại'}
                >
                  {copied ? (
                    // check icon when copied
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    // clipboard / copy icon
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M16 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H8C6.9 20 6 19.1 6 18V6C6 4.9 6.9 4 8 4H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="9" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="9" y="8" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="qr-code-section">
              <img
                src={ZaloQRImage}
                alt="QR Code Zalo"
                className="zalo-qr-image"
              />
              <p className="qr-caption">Mở Zalo, bấm biểu tượng <span className="icon-scan"></span> rồi quét và trải nghiệm dịch vụ</p>
            </div>
          </div>
        </div>

        {/* Phần dịch vụ cung cấp */}
        <div className="services-card">
          <h2 className="info-title">Dịch vụ cung cấp</h2>
          <div className="service-tags">
            <span className="service-tag">Hotline</span>
            <span className="service-tag">Website</span>
            {/* Thêm các dịch vụ khác nếu có */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;