import React from "react";
import { useParams } from "react-router-dom";
import "./NewsDetail.css";

// Import hình
import ImgAI from "../../assets/images/IconLogo.png";
import ImgAdobeNew from "../../assets/images/new-adobe.png";
import ImgAdobe from "../../assets/images/adobe.png";

export default function NewsDetail() {
  const { slug } = useParams();

  // =============================
  //      DỮ LIỆU 3 BÀI NEWS
  // =============================
  const newsData = {
    "ai-assistant-2026": {
      title:
        "Top các trợ lý ảo AI thông minh dự kiến sẽ hỗ trợ đắc lực cho công việc năm 2026",
      image: ImgAI,
      content: (
        <>
          <p>
            Trong năm 2026, trí tuệ nhân tạo (AI) sẽ phát triển vượt bậc, mang đến
            nhiều trợ lý ảo mới mạnh mẽ hơn, thông minh hơn và hỗ trợ con người
            sâu sát hơn trong công việc. Trợ lý ảo không chỉ là công cụ trả lời
            câu hỏi, mà sẽ trở thành đồng nghiệp thực thụ giúp tự động hóa,
            phân tích dữ liệu và tối ưu hiệu suất cá nhân.
          </p>

          <h2>1. AI trở thành “người đồng hành” của mọi ngành nghề</h2>
          <p>
            Các trợ lý ảo AI thế hệ mới có khả năng hiểu ngữ cảnh sâu, đưa ra lời
            khuyên phù hợp và thực hiện nhiều tác vụ thay con người như:
          </p>

          <ul>
            <li>✔ Viết email, hợp đồng, tài liệu nhanh chóng</li>
            <li>✔ Phân tích dữ liệu doanh số, dự đoán xu hướng</li>
            <li>✔ Lập kế hoạch làm việc, nhắc lịch thông minh</li>
            <li>✔ Tạo hình ảnh, video, slide thuyết trình</li>
            <li>✔ Hỗ trợ lập trình – debug mã lỗi</li>
          </ul>

          <h2>2. Tính năng nổi bật của AI trong năm 2026</h2>

          <div className="highlight">
            Công nghệ mô hình ngôn ngữ lớn (LLM) sẽ đạt độ chính xác cực cao,
            vận hành như một chuyên gia thực thụ trong từng lĩnh vực.
          </div>

          <ul>
            <li>⚡ Tốc độ xử lý nhanh gấp 10 lần hiện tại</li>
            <li>⚡ Hiểu giọng nói tự nhiên, không cần câu lệnh cứng</li>
            <li>⚡ Kết nối API để điều khiển phần mềm khác</li>
            <li>⚡ Tự học từ thói quen người dùng</li>
            <li>⚡ Đề xuất giải pháp thông minh theo từng cá nhân</li>
          </ul>

          <h2>3. Ứng dụng AI cho doanh nghiệp</h2>
          <p>
            Doanh nghiệp sẽ ứng dụng AI trong các mảng quan trọng như:
          </p>

          <ul>
            <li>📈 Phân tích marketing – hành vi khách hàng</li>
            <li>💬 Chăm sóc khách hàng 24/7 không cần nhân viên</li>
            <li>📦 Quản lý kho – dự đoán tồn kho tối ưu</li>
            <li>💰 Kiểm toán – tài chính – báo cáo tự động</li>
          </ul>

          <h2>Kết luận</h2>
          <p>
            AI không chỉ dừng lại ở mức “trợ lý”, mà đang trở thành hệ sinh thái thông minh
            giúp doanh nghiệp và cá nhân tăng tốc trong học tập – công việc – sáng tạo. 
            Năm 2026 sẽ là năm bùng nổ của các trợ lý AI toàn năng.
          </p>
        </>
      ),
    },

    // ==================================================
    //                BÀI 2 – ADOBE OFFICIAL
    // ==================================================
    "adobe-official": {
      title:
        "Adobe Bản Quyền Chính Hãng Tại HCM: Ưu Đãi Sốc Giá Tốt Nhất 2025",
      image: ImgAdobeNew,
      content: (
        <>
          <p>
            Adobe Creative Cloud là bộ ứng dụng thiết kế mạnh nhất thế giới, bao gồm:
            Photoshop, Illustrator, After Effects, Premiere, Lightroom… Đây là công cụ
            không thể thiếu cho designer, editor, photographer và marketer chuyên nghiệp.
          </p>

          <h2>1. Vì sao nên dùng Adobe bản quyền?</h2>

          <ul>
            <li>✔ Không bị khóa tài khoản bất ngờ</li>
            <li>✔ Update phiên bản mới nhất liên tục</li>
            <li>✔ Ổn định – mượt – không bị crash</li>
            <li>✔ Đồng bộ cloud trên mọi thiết bị</li>
            <li>✔ Xuất file chất lượng cao, không watermark</li>
          </ul>

          <h2>2. Adobe bản quyền tại HCM – giá tốt hơn 70%</h2>

          <p>
            Tại Digitech Shop, bạn có thể sở hữu Adobe với giá rẻ hơn rất nhiều so với 
            mua trực tiếp từ website Adobe, nhưng vẫn đảm bảo bản quyền và có hỗ trợ bảo hành.
          </p>

          <div className="highlight">
            Gói Adobe All Apps 2025 – chỉ từ <b>1/5 giá gốc</b>.
          </div>

          <h2>3. Quyền lợi khi mua Adobe tại Digitech Shop</h2>

          <ul>
            <li>💙 Kích hoạt nhanh trong 5 phút</li>
            <li>💙 Hỗ trợ cài đặt từ A–Z</li>
            <li>💙 Bảo hành xuyên suốt thời gian sử dụng</li>
            <li>💙 Hướng dẫn tối ưu hiệu suất máy</li>
          </ul>

          <h2>4. Ứng dụng của Adobe trong công việc</h2>

          <ul>
            <li>🎨 Thiết kế logo – banner – poster</li>
            <li>🎬 Dựng video quảng cáo – MV – vlog</li>
            <li>📸 Edit ảnh – blend màu chuyên nghiệp</li>
            <li>📚 Thiết kế giáo trình, tài liệu học</li>
          </ul>

          <h2>Kết luận</h2>
          <p>
            Adobe bản quyền giúp công việc thiết kế – dựng phim trở nên mượt mà và chuyên nghiệp hơn.
            Nếu bạn muốn sở hữu Adobe với mức giá tiết kiệm nhất tại HCM,
            Digitech Shop là lựa chọn đáng tin cậy.
          </p>
        </>
      ),
    },

    // ==================================================
    //                BÀI 3 – ADOBE CHEAP
    // ==================================================
    "adobe-cheap": {
      title:
        "Adobe Bản Quyền Giá Rẻ Nhất HCM: Ưu Đãi Sốc Cho Designer 2025!",
      image: ImgAdobe,
      content: (
        <>
          <p>
            Trong năm 2025, nhu cầu sử dụng Adobe tăng mạnh do sự bùng nổ của nội dung
            số: video, poster, thiết kế branding và quảng cáo. Việc sở hữu Adobe bản quyền giá rẻ
            giúp designer và editor tiết kiệm chi phí mà vẫn đảm bảo chất lượng công việc.
          </p>

          <h2>1. Adobe giá rẻ có đáng tin không?</h2>
          <p>
            Nhiều người lo ngại Adobe giá rẻ là hàng lậu – hàng crack. Nhưng tại Digitech Shop,
            bạn nhận được:
          </p>

          <ul>
            <li>✔ Tài khoản chính chủ</li>
            <li>✔ Có thể dùng trên nhiều thiết bị</li>
            <li>✔ Update liên tục</li>
            <li>✔ Hỗ trợ kiểm tra bản quyền</li>
          </ul>

          <h2>2. Lợi ích khi dùng Adobe bản quyền</h2>

          <ul>
            <li>⚡ Hiệu suất phần mềm cao hơn 40%</li>
            <li>⚡ Không giật lag khi render video</li>
            <li>⚡ Không lo virus / malware từ bản crack</li>
            <li>⚡ Import – Export file không lỗi font</li>
          </ul>

          <h2>3. Những phần mềm Adobe được dùng nhiều nhất</h2>
          <ul>
            <li>🎨 <b>Photoshop</b> – chỉnh ảnh chuyên nghiệp</li>
            <li>🎬 <b>Premiere Pro</b> – dựng video chuẩn Hollywood</li>
            <li>✨ <b>After Effects</b> – motion graphics</li>
            <li>📐 <b>Illustrator</b> – thiết kế vector</li>
            <li>📷 <b>Lightroom</b> – chỉnh ảnh RAW</li>
          </ul>

          <h2>4. Vì sao nên mua tại Digitech Shop?</h2>

          <div className="highlight">
            Giá rẻ nhất thị trường – Full bảo hành – Hỗ trợ 24/7.
          </div>

          <p>
            Bạn chỉ cần thanh toán → Shop gửi hướng dẫn cài đặt 
            → Tài khoản lên bản quyền sau 3 phút.
          </p>

          <h2>Kết luận</h2>
          <p>
            Nếu bạn đang tìm nơi cung cấp Adobe bản quyền giá rẻ, chất lượng,
            Digitech Shop là lựa chọn hàng đầu, phù hợp cho freelancer, designer và editor.
          </p>
        </>
      ),
    },
  };

  // Lấy nội dung đúng theo slug
  const data = newsData[slug];

  if (!data)
    return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Không tìm thấy bài viết</h2>;

  return (
    <div className="news-detail">
      <h1>{data.title}</h1>

      <img
        src={data.image}
        alt={data.title}
        className="news-detail-img"
      />

      {data.content}
    </div>
  );
}
