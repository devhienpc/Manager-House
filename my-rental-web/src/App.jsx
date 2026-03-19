// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import RoomList from "./components/RoomList";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    // BrowserRouter phải bọc ngoài cùng để router hoạt động
    <BrowserRouter>
      {/* AuthProvider nằm bên trong BrowserRouter để dùng được useNavigate */}
      <AuthProvider>
        {/* Navbar hiển thị trên mọi trang */}
        <Navbar />

        {/* Nội dung trang thay đổi theo URL */}
        <main className="min-h-screen bg-slate-100 py-8">
          <Routes>
            <Route path="/" element={<RoomList />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
