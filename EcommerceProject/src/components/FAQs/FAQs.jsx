import React, { useState } from "react";
import "./FAQs.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqList = [
    {
      question: "Tôi có thể thanh toán bằng những phương thức nào?",
      answer:
        "Chúng tôi hỗ trợ nhiều hình thức thanh toán như chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay), và thanh toán qua thẻ quốc tế (Visa, MasterCard).",
    },
    {
      question: "Phần mềm có được bảo hành không?",
      answer:
        "Mọi sản phẩm đều đi kèm bảo hành điện tử và cam kết cập nhật theo chính sách từ nhà phát hành.",
    },
    {
      question: "Sau khi mua tôi sẽ nhận key như thế nào?",
      answer:
        "Sau khi thanh toán thành công, key bản quyền sẽ được gửi trực tiếp đến email mà bạn đã đăng ký.",
    },
    {
      question: "Tôi có thể hoàn tiền không?",
      answer:
        "Trong trường hợp key lỗi hoặc không thể kích hoạt, chúng tôi sẽ hoàn tiền 100% hoặc đổi sản phẩm khác theo yêu cầu.",
    },
  ];

  return (
    <div className="faqs-page container">
      <h1>FAQs - Câu hỏi thường gặp</h1>
      <p className="faqs-subtitle">
        Giải đáp nhanh các thắc mắc để bạn yên tâm mua sắm tại Shop Software.
      </p>
      <div className="faq-list">
        {faqList.map((faq, index) => (
          <div
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            key={index}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              {openIndex === index ? (
                <FaChevronUp className="icon" />
              ) : (
                <FaChevronDown className="icon" />
              )}
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
