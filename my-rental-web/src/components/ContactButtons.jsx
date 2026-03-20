// src/components/ContactButtons.jsx
import { Phone } from "lucide-react";

// Mã nguồn SVG nguyên bản của Zalo
const ZaloIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Màu xanh đặc trưng của Zalo */}
    <path d="M21.2215 11.2343C21.2215 15.6881 17.0691 19.3005 11.9546 19.3005C10.8715 19.3005 9.83984 19.1274 8.89274 18.8106L4.54228 20.3204L5.6133 16.591C3.65787 15.2443 2.45428 13.3421 2.45428 11.2343C2.45428 6.78051 6.6067 3.16812 11.7212 3.16812C16.8357 3.16812 21.2215 6.78051 21.2215 11.2343Z" fill="#0068FF"/>
    {/* Chữ ZALO màu trắng */}
    <path d="M7.74902 12.871H9.95423C10.2798 12.871 10.5133 12.597 10.5133 12.2713C10.5133 11.9457 10.2798 11.6717 9.95423 11.6717H8.62933L10.3802 9.53123C10.4633 9.42838 10.5054 9.29952 10.5054 9.17122C10.5054 8.87102 10.2719 8.63857 9.97171 8.63857H7.76652C7.44093 8.63857 7.20743 8.91257 7.20743 9.23817C7.20743 9.56377 7.44093 9.83777 7.76652 9.83777H9.09142L7.34057 11.9783C7.25746 12.0811 7.21535 12.21 7.21535 12.3383C7.21535 12.6385 7.44883 12.871 7.74902 12.871ZM14.6542 8.57147C13.435 8.57147 12.4419 9.56457 12.4419 10.7838V10.8258C12.4419 12.045 13.435 13.0381 14.6542 13.0381C15.8734 13.0381 16.8665 12.045 16.8665 10.8258V10.7838C16.8665 9.56457 15.8735 8.57147 14.6542 8.57147ZM15.7003 10.8258C15.7003 11.4026 15.2317 11.8712 14.655 11.8712C14.0782 11.8712 13.6096 11.4026 13.6096 10.8258V10.7838C13.6096 11.207 14.0782 10.7383 14.655 10.7383C15.2317 10.7383 15.7003 11.207 15.7003 10.7838V10.8258ZM11.4011 15.0044V14.1557C11.4011 13.564 12.0253 13.2514 12.5002 13.535C13.1201 13.9056 13.8569 14.1205 14.6517 14.1205C15.4466 14.1205 16.1834 13.9056 16.8033 13.535C17.2782 13.2514 17.9024 13.564 17.9024 14.1557V15.0044C17.9024 15.5539 17.457 16 16.9075 16H12.396C11.8465 16 11.4011 15.5539 11.4011 15.0044Z" fill="white"/>
  </svg>
);

export default function ContactButtons() {
  return (
    <>
      <style>
        {`
          /* Hiệu ứng rung rinh (wiggle) giống điện thoại đang reo */
          @keyframes wiggle {
            0%, 100% { transform: rotate(-10deg) scale(1); }
            50% { transform: rotate(10deg) scale(1.1); }
          }
          .animate-wiggle {
            animation: wiggle 0.6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Container nằm đè lên mọi thứ, cố định ở góc dưới phải */}
      <div className="fixed bottom-8 right-6 z-[100] flex flex-col gap-5">
        
        {/* Nút Điện thoại */}
        <a
          href="tel:0325855304"
          className="relative flex items-center justify-center w-[56px] h-[56px] rounded-full bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.5)] pointer-events-auto hover:bg-green-600 transition-colors group"
          title="Gọi điện tư vấn"
        >
          {/* Lớp sóng tỏa ra ngoài */}
          <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-60"></span>
          {/* Icon rung rinh */}
          <Phone size={26} className="text-white z-10 animate-wiggle" fill="currentColor" />
        </a>

        {/* Nút Zalo */}
        <a
          href="https://zalo.me/0325855304"
          target="_blank"
          rel="noreferrer"
          className="relative flex items-center justify-center w-[56px] h-[56px] rounded-full bg-white shadow-[0_4px_20px_rgba(0,104,255,0.4)] pointer-events-auto hover:scale-110 transition-transform group"
          title="Nhắn tin Zalo"
        >
          {/* Lớp sóng xanh */}
          <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30" style={{ animationDelay: '0.5s' }}></span>
          {/* Icon rung rinh (đảo hướng để nhìn tự nhiên hơn) */}
          <ZaloIcon size={34} className="z-10 animate-wiggle" style={{ animationDirection: 'reverse' }} />
        </a>

      </div>
    </>
  );
}
