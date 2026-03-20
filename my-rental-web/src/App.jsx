// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import RoomList from "./components/RoomList";
import LoginPage from "./components/LoginPage";
import ContactButtons from "./components/ContactButtons";

function App() {
  return (
    // BrowserRouter phải bọc ngoài cùng để router hoạt động.
    // Dùng basename để tự động nhận cấu hình base='/Manager-House/' từ vite.config.js
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* AuthProvider nằm bên trong BrowserRouter để dùng được useNavigate */}
      <AuthProvider>
        {/* Navbar hiển thị trên mọi trang */}
        <Navbar />

        {/* Nội dung trang thay đổi theo URL */}
        <main 
          className="min-h-screen py-8 relative transition-colors duration-300"
          style={{ backgroundImage: "var(--bg-secondary)" }}
        >
          <Routes>
            <Route path="/" element={<RoomList />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>

          {/* Các nút liên hệ động cố định dưới góc phải */}
          <ContactButtons />
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
