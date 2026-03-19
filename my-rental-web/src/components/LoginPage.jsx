// src/components/LoginPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Giả lập độ trễ nhỏ cho cảm giác xác thực thật hơn
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card chứa Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏠</div>
            <h1 className="text-2xl font-bold text-gray-800">Đăng nhập Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý hệ thống phòng trọ</p>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg
                hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác thực..." : "🔐 Đăng nhập"}
            </button>
          </form>

          {/* Link quay lại */}
          <p className="text-center text-sm text-gray-400 mt-6">
            <Link to="/" className="text-blue-500 hover:underline">
              ← Quay lại trang danh sách phòng
            </Link>
          </p>
        </div>

        {/* Gợi ý tài khoản demo */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: <span className="font-mono bg-white/70 px-1 rounded">admin</span> /{" "}
          <span className="font-mono bg-white/70 px-1 rounded">hienpc</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
