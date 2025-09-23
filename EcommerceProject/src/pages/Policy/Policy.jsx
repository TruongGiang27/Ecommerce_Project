import React from "react";
import "./policy.css";

export default function Policy() {
  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">Chính Sách Bảo Mật</h1>
        <p className="policy-intro">
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và tuân thủ các quy
          định về bảo mật dữ liệu.
        </p>

        <section className="policy-section">
          <h2 className="section-title">1. Thu thập thông tin</h2>
          <p className="section-content">
            Chúng tôi thu thập thông tin cá nhân như tên, email, địa chỉ giao
            hàng và thông tin thanh toán khi bạn đặt hàng trên trang web của
            chúng tôi.
          </p>
        </section>

        {/* Tiếp tục với các section khác tương tự */}
        <section className="policy-section">
          <h2 className="section-title">2. Sử dụng thông tin</h2>
          <p className="section-content">
            Thông tin cá nhân của bạn được sử dụng để xử lý đơn hàng, cung cấp
            dịch vụ khách hàng và cải thiện trải nghiệm mua sắm.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">3. Bảo mật thông tin</h2>
          <p className="section-content">
            Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo
            vệ thông tin cá nhân của bạn khỏi truy cập trái phép, mất mát hoặc
            lạm dụng.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">4. Chia sẻ thông tin</h2>
          <p className="section-content">
            Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba trừ
            khi có sự đồng ý của bạn hoặc theo yêu cầu pháp luật.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">5. Quyền của bạn</h2>
          <p className="section-content">
            Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình
            bằng cách liên hệ với chúng tôi qua email hỗ trợ.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">6. Thay đổi chính sách</h2>
          <p className="section-content">
            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi
            thay đổi sẽ được thông báo trên trang web của chúng tôi.
          </p>
        </section>

        <div className="policy-footer">
          <p className="contact-info">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi,
            vui lòng liên hệ với chúng tôi qua email hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}
