// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// ==========================================
// Tạo Context
// ==========================================
const AuthContext = createContext(null);

// ==========================================
// Tài khoản Admin cứng (hardcoded)
// ==========================================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "hienpc";

// ==========================================
// AuthProvider — Bọc ngoài toàn bộ App
// ==========================================
export function AuthProvider({ children }) {
  // Khởi tạo từ localStorage để refresh không bị đăng xuất
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const navigate = useNavigate();

  // Hàm đăng nhập — trả về true/false để LoginPage biết kết quả
  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/"); // Chuyển về trang chủ
      return true;
    }
    return false; // Sai thông tin
  };

  // Hàm đăng xuất
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// Hook tiện lợi để dùng trong các component
// ==========================================
export function useAuth() {
  return useContext(AuthContext);
}
