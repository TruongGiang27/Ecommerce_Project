import React from "react";
import { useParams } from "react-router-dom";
import "./GuideDetail.css";

// Import hình
import ImgCanva from "../../assets/images/canva-pro.png";
import ImgCountif from "../../assets/images/IconLogo.png";
import ImgQuizlet from "../../assets/images/quizlet.png";

export default function GuideDetail() {
  const { slug } = useParams();

  // ==========================
  //   DỮ LIỆU 3 BÀI HƯỚNG DẪN
  // ==========================
  const guides = {
    "canva-pro": {
      title: "Mua tài khoản Canva Pro chính chủ giá tốt tại Digitech Shop",
      image: ImgCanva,
      content: (
        <>
          <p>
            Canva Pro là phiên bản nâng cấp mạnh mẽ của Canva, mang đến kho tài nguyên khổng lồ,
            tính năng cao cấp và sự tiện lợi vượt trội so với bản miễn phí. Đây là công cụ được 
            các marketer, designer, chủ shop online, KOL, freelancer và sinh viên sử dụng mỗi ngày
            vì sự đơn giản nhưng hiệu quả mà nó mang lại.
          </p>

          <h2>1. Canva Pro có gì khác so với bản miễn phí?</h2>
          <ul>
            <li>✨ 100 triệu+ hình ảnh, video, icon chất lượng cao</li>
            <li>✨ Hơn 610.000 template chuyên nghiệp</li>
            <li>✨ Background Remover – xóa nền nhanh 1 chạm</li>
            <li>✨ Resize cho mọi nền tảng mạng xã hội</li>
            <li>✨ Brand Kit – quản lý nhận diện thương hiệu</li>
            <li>✨ Magic Write – AI viết nội dung cực nhanh</li>
            <li>✨ Lưu trữ 1TB cloud</li>
          </ul>

          <h2>2. Ai nên dùng Canva Pro?</h2>
          <ul>
            <li>✔ Chủ shop online cần hình ảnh đẹp</li>
            <li>✔ Các marketer chạy quảng cáo</li>
            <li>✔ Sinh viên cần làm poster, thuyết trình</li>
            <li>✔ Người sáng tạo nội dung TikTok, Reels</li>
            <li>✔ Người làm social media cho doanh nghiệp</li>
          </ul>

          <h2>3. Tại sao nên mua tại Digitech Shop?</h2>
          <div className="highlight">
            Digitech Shop là đơn vị cung cấp phần mềm bản quyền uy tín – giá rẻ – hỗ trợ 24/7.
          </div>

          <ul>
            <li>💙 Giá rẻ hơn 70–80% so với mua trực tiếp</li>
            <li>💙 Kích hoạt nhanh trong 1–3 phút</li>
            <li>💙 Sử dụng email chính chủ của bạn</li>
            <li>💙 Bảo hành xuyên suốt thời gian dùng</li>
            <li>💙 Không bị kick ra khỏi team</li>
          </ul>

          <h2>4. Cách kích hoạt Canva Pro</h2>
          <ol>
            <li>Bước 1: Gửi email bạn muốn kích hoạt</li>
            <li>Bước 2: Nhận link mời từ Digitech Shop</li>
            <li>Bước 3: Nhấn “Accept Invitation” → Tài khoản lên Pro ngay</li>
          </ol>

          <h2>5. Kết luận</h2>
          <p>
            Canva Pro là lựa chọn hoàn hảo cho bất kỳ ai muốn thiết kế đẹp – nhanh – chuyên nghiệp.
            Với giá tiết kiệm tại Digitech Shop, bạn được trải nghiệm toàn bộ tính năng cao cấp mà 
            không cần trả chi phí quá cao.
          </p>
        </>
      ),
    },

    // ==========================
    //       BÀI 2 – COUNTIF
    // ==========================
    countif: {
      title: "Hướng dẫn dùng hàm COUNTIF trong Google Sheet chi tiết",
      image: ImgCountif,
      content: (
        <>
          <p>
            Hàm COUNTIF là hàm thống kê quan trọng giúp đếm số ô thỏa mãn một điều kiện nhất định.
            Đây là hàm cơ bản nhưng cực kỳ mạnh, được dùng trong kế toán, kinh doanh, học tập và phân tích dữ liệu.
          </p>

          <h2>1. Hàm COUNTIF dùng để làm gì?</h2>
          <ul>
            <li>✔ Đếm số đơn hàng theo trạng thái</li>
            <li>✔ Đếm số học sinh đạt điểm trên 8</li>
            <li>✔ Kiểm tra số lượng sản phẩm tồn kho</li>
            <li>✔ Thống kê số email trùng</li>
            <li>✔ Theo dõi tần suất xuất hiện của một giá trị</li>
          </ul>

          <h2>2. Cú pháp COUNTIF</h2>
          <div className="highlight">
            <b>COUNTIF(range, criteria)</b>
          </div>

          <h2>3. Ví dụ cơ bản</h2>
          <p>Đếm số ô có chữ “Apple”:</p>
          <div className="highlight">=COUNTIF(A1:A20, "Apple")</div>

          <h2>4. COUNTIF với điều kiện số</h2>
          <div className="highlight">=COUNTIF(B2:B100, "&gt;8")</div>

          <h2>5. COUNTIF với ký tự đại diện</h2>
          <p>Đếm từ bắt đầu bằng “A”:</p>
          <div className="highlight">=COUNTIF(A2:A50, "A*")</div>

          <p>Đếm tên có 5 ký tự:</p>
          <div className="highlight">=COUNTIF(A2:A50, "?????")</div>

          <h2>6. Lỗi thường gặp</h2>
          <ul>
            <li>❗ Thiếu dấu ngoặc kép</li>
            <li>❗ Dùng criteria sai kiểu dữ liệu</li>
            <li>❗ Range không đồng nhất</li>
          </ul>

          <h2>7. COUNTIF vs COUNTIFS</h2>
          <p>
            COUNTIF chỉ dùng cho 1 điều kiện.  
            COUNTIFS dùng cho nhiều điều kiện (tới 10 điều kiện cùng lúc).
          </p>

          <h2>Kết luận</h2>
          <p>
            COUNTIF là hàm quan trọng và dễ học. Hiểu đúng COUNTIF giúp tiết kiệm hàng giờ xử lý 
            dữ liệu mỗi ngày.
          </p>
        </>
      ),
    },

    // ==========================
    //       BÀI 3 – QUIZLET
    // ==========================
    quizlet: {
      title: "Hướng dẫn tạo Quiz trên Quizlet – Cách tạo đề kiểm tra hiệu quả",
      image: ImgQuizlet,
      content: (
        <>
          <p>
            Quizlet là nền tảng học tập cực mạnh giúp tạo flashcard, bài ôn tập và quiz kiểm tra.
            Đây là công cụ hỗ trợ tuyệt vời cho học sinh, giáo viên và người tự học.
          </p>

          <h2>1. Ai nên dùng Quizlet?</h2>
          <ul>
            <li>✔ Học sinh – sinh viên ôn thi</li>
            <li>✔ Giáo viên tạo bài tập cho lớp</li>
            <li>✔ Người học ngoại ngữ</li>
            <li>✔ Phụ huynh muốn dạy con dễ hiểu</li>
          </ul>

          <h2>2. Cách tạo bài Quiz</h2>

          <h3>Bước 1: Tạo Study Set</h3>
          <ul>
            <li>Nhấn nút “Create”</li>
            <li>Thêm câu hỏi và định nghĩa</li>
            <li>Có thể thêm hình minh họa</li>
          </ul>

          <h3>Bước 2: Chọn chế độ học</h3>
          <ul>
            <li>🔹 Flashcards</li>
            <li>🔹 Learn</li>
            <li>🔹 Test</li>
            <li>🔹 Match</li>
            <li>🔹 Gravity</li>
          </ul>

          <div className="highlight">
            Quizlet tự động sinh đề kiểm tra dựa trên nội dung bạn nhập — cực kỳ tiện.
          </div>

          <h2>3. Chia sẻ bài Quiz</h2>
          <ul>
            <li>🔗 Gửi link trực tiếp</li>
            <li>📄 Xuất PDF</li>
            <li>📱 Chia sẻ bằng QR Code</li>
            <li>🏫 Tạo lớp học và quản lý học viên</li>
          </ul>

          <h2>4. Lợi ích khi dùng Quizlet Pro</h2>
          <ul>
            <li>⚡ Không giới hạn học phần</li>
            <li>⚡ Báo cáo tiến độ học chi tiết</li>
            <li>⚡ Không quảng cáo</li>
            <li>⚡ Tải ảnh chất lượng cao</li>
          </ul>

          <h2>Kết luận</h2>
          <p>
            Quizlet giúp việc học trở nên đơn giản và thú vị hơn. Nếu bạn muốn ghi nhớ nhanh 
            và ôn tập hiệu quả, Quizlet là công cụ không thể thiếu.
          </p>
        </>
      ),
    },
  };

  // ==================================
  //    XỬ LÝ NỘI DUNG THEO SLUG
  // ==================================
  const guide = guides[slug];

  if (!guide)
    return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Không tìm thấy bài hướng dẫn</h2>;

  return (
    <div className="guide-detail">
      <h1>{guide.title}</h1>

      <img
        src={guide.image}
        alt={guide.title}
        style={{ width: "100%", borderRadius: "10px", margin: "20px 0" }}
      />

      {guide.content}
    </div>
  );
}
