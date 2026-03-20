// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo + Tên App */}
        <Link to="/" className="flex items-center gap-2 font-black text-3xl tracking-tight">
          <span className="text-[1.2em] drop-shadow-sm">🏠</span>
          <span className="bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-transparent bg-clip-text">
            Manager House
          </span>
        </Link>

        {/* Phần phải: trạng thái đăng nhập */}
        {isLoggedIn ? (
          // ĐÃ ĐĂNG NHẬP: hiện tên + nút Đăng xuất
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              👤 Xin chào, <span className="font-semibold text-gray-800">Admin</span>
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
    </nav>
  );
}

export default Navbar;
