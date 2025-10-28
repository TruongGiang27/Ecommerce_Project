import React from 'react';
import './PhoneSupport.css';

const PhoneSupport = ({ to = '/support', ariaLabel = 'Đi tới trang hỗ trợ' }) => {
  return (
    <div className="phone-support">
      <a href={to} className="phone-support-btn" aria-label={ariaLabel} title="Hỗ trợ">
        {/* phone icon */}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.47 2.07 1.03 3.02a2 2 0 0 1-.45 2.11L9.91 10.09a16 16 0 0 0 6 6l1.24-1.24a2 2 0 0 1 2.11-.45c.95.56 1.97.91 3.02 1.03A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
};

export default PhoneSupport;