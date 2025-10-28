// File: src/components/ContactForm.jsx

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css'; // (Nhớ tạo file CSS để có giao diện đẹp)

const ContactForm = () => {
    const form = useRef();
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();
        setStatusMessage('');
        setIsSending(true);

        // 1. Lấy các khóa từ biến môi trường
        const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
        const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

        // 2. Gọi hàm gửi email của EmailJS
        emailjs.sendForm(serviceID, templateID, form.current, publicKey)
            .then((result) => {
                setStatusMessage('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.');
                form.current.reset();
            }, (error) => {
                console.error('Lỗi gửi email:', error.text);
                setStatusMessage('Gửi tin nhắn thất bại. Vui lòng thử lại.');
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <div className="contact-page-wrapper">
            <div className="contact-container">
                <h2>Thông tin Liên Hệ</h2>
                <form ref={form} onSubmit={sendEmail} className="contact-form">

                    <div className="form-group">
                        <label>Tên của bạn</label>
                        {/* Tên 'user_name' PHẢI khớp với biến {{user_name}} trong EmailJS Template */}
                        <input type="text" name="name" required />
                    </div>

                    <div className="form-group">
                        <label>Email của bạn</label>
                        {/* Tên 'user_email' PHẢI khớp với biến {{user_email}} trong EmailJS Template */}
                        <input type="email" name="email" required />
                    </div>

                    <div className="form-group">
                        <label>Nội dung tin nhắn</label>
                        {/* Tên 'message' PHẢI khớp với biến {{message}} trong EmailJS Template */}
                        <textarea name="message" rows="5" required></textarea>
                    </div>

                    <button type="submit" disabled={isSending}>
                        {isSending ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                    </button>

                    {statusMessage && <p className="status-message">{statusMessage}</p>}
                </form>
            </div>
        </div>

    );
};

export default ContactForm;