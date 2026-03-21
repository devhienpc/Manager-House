// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";
import myLogo from "../assets/logo.png";
import { Phone, Facebook, Moon, Sun } from "lucide-react";

const ZaloIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.2215 11.2343C21.2215 15.6881 17.0691 19.3005 11.9546 19.3005C10.8715 19.3005 9.83984 19.1274 8.89274 18.8106L4.54228 20.3204L5.6133 16.591C3.65787 15.2443 2.45428 13.3421 2.45428 11.2343C2.45428 6.78051 6.6067 3.16812 11.7212 3.16812C16.8357 3.16812 21.2215 6.78051 21.2215 11.2343Z" fill="#0068FF" />
    <path d="M7.74902 12.871H9.95423C10.2798 12.871 10.5133 12.597 10.5133 12.2713C10.5133 11.9457 10.2798 11.6717 9.95423 11.6717H8.62933L10.3802 9.53123C10.4633 9.42838 10.5054 9.29952 10.5054 9.17122C10.5054 8.87102 10.2719 8.63857 9.97171 8.63857H7.76652C7.44093 8.63857 7.20743 8.91257 7.20743 9.23817C7.20743 9.56377 7.44093 9.83777 7.76652 9.83777H9.09142L7.34057 11.9783C7.25746 12.0811 7.21535 12.21 7.21535 12.3383C7.21535 12.6385 7.44883 12.871 7.74902 12.871ZM14.6542 8.57147C13.435 8.57147 12.4419 9.56457 12.4419 10.7838V10.8258C12.4419 12.045 13.435 13.0381 14.6542 13.0381C15.8734 13.0381 16.8665 12.045 16.8665 10.8258V10.7838C16.8665 9.56457 15.8735 8.57147 14.6542 8.57147ZM15.7003 10.8258C15.7003 11.4026 15.2317 11.8712 14.655 11.8712C14.0782 11.8712 13.6096 11.4026 13.6096 10.8258V10.7838C13.6096 11.207 14.0782 10.7383 14.655 10.7383C15.2317 10.7383 15.7003 11.207 15.7003 10.7838V10.8258ZM11.4011 15.0044V14.1557C11.4011 13.564 12.0253 13.2514 12.5002 13.535C13.1201 13.9056 13.8569 14.1205 14.6517 14.1205C15.4466 14.1205 16.1834 13.9056 16.8033 13.535C17.2782 13.2514 17.9024 13.564 17.9024 14.1557V15.0044C17.9024 15.5539 17.457 16 16.9075 16H12.396C11.8465 16 11.4011 15.5539 11.4011 15.0044Z" fill="white" />
  </svg>
);

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <nav className="bg-[var(--card-bg)] border-b border-[var(--border-subtle)] shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo + Tên App */}
        <Link to="/" className="flex items-center gap-3 font-black text-3xl tracking-tight">
          <img
            src={myLogo}
            alt="Manager House Logo"
            className="h-9 w-auto object-contain shrink-0 drop-shadow-sm"
          />
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text mt-1">
            Star House
          </span>
        </Link>

        {/* Phần phải: Liên hệ + Trạng thái đăng nhập */}
        <div className="flex items-center gap-4 sm:gap-6">

          {/* Nút Dark Mode */}
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer text-[var(--text-primary)]"
            title={isDarkMode ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Thông báo liên hệ */}
          <div className="hidden sm:flex items-center gap-5 border-r border-[var(--border-subtle)] pr-6">
            <a
              href="tel:0325855304"
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF7E5F] transition-all hover:scale-110"
              title="Gọi điện"
            >
              <Phone size={18} />
              <span className="font-semibold text-sm tracking-wide">0325.855.304</span>
            </a>

            <a
              href="https://zalo.me/0325855304"
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/50 hover:bg-blue-100 transition-all hover:shadow-md cursor-pointer dark:bg-blue-900/20 dark:border-blue-700/50 dark:hover:bg-blue-900/40"
              title="Nhắn tin Zalo để xem phòng miễn phí"
            >
              <div className="relative flex">
                <ZaloIcon size={22} className="relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              </div>
              <span className="hidden lg:block text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide whitespace-nowrap">
                Liên hệ xem phòng miễn phí
              </span>
            </a>

            <a
              href="https://www.facebook.com/truong.van.hien.769494/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1877F2] hover:scale-110 transition-transform hover:brightness-110"
              title="Trang cá nhân Facebook"
            >
              <Facebook size={24} fill="currentColor" strokeWidth={0} />
            </a>
          </div>

          {/* Trạng thái đăng nhập */}
          {isLoggedIn ? (
            // ĐÃ ĐĂNG NHẬP: hiện tên + nút Đăng xuất
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-secondary)]">
                👤 Xin chào, <span className="font-semibold text-[var(--text-primary)]">Admin</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-1.5 text-sm font-semibold rounded-lg border border-red-300
                  text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            // CHƯA ĐĂNG NHẬP: nút Đăng nhập
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-blue-600
                text-white hover:bg-blue-700 transition-colors"
            >
              🔐 Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
