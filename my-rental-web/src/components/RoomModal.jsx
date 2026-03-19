// src/components/RoomModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function RoomModal({ room, onClose, onDelete, onCopy }) {
  const { isLoggedIn } = useAuth();
  const isAdmin = isLoggedIn;
  const isAvailable = room.status === "Còn trống";

  // Slider ảnh (room.images là mảng, fallback về room.image)
  const images = room.images?.length > 0 ? room.images : [room.image];
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text =
      `${room.title}\n` +
      `📍 Địa chỉ: ${room.address}\n` +
      `💰 Giá: ${room.price}\n` +
      `📸 Ảnh: ${images[0]}\n` +
      `🔍 Trạng thái: ${room.status}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onCopy(); // hiện Toast ở RoomList
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = () => {
    if (window.confirm("Bạn chắc chắn muốn xóa phòng này?")) {
      onDelete(room.id);
      onClose();
    }
  };

  return (
    // Backdrop — bấm ra ngoài để đóng
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Hộp Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center
            bg-black/40 hover:bg-black/60 text-white rounded-full text-lg font-bold
            transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          ×
        </button>

        {/* ── PHẦN ẢNH ── */}
        <div className="relative">
          {/* Ảnh chính */}
          <img
            src={images[activeImg]}
            alt={room.title}
            className="w-full h-72 sm:h-96 object-cover rounded-t-2xl"
          />

          {/* Badge trạng thái đè lên ảnh */}
          <span
            className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-semibold shadow
              ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {room.status}
          </span>
        </div>

        {/* Thumbnail slider (chỉ hiện khi có > 1 ảnh) */}
        {images.length > 1 && (
          <div className="flex gap-2 px-5 pt-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                  ${activeImg === i ? "border-blue-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ── PHẦN NỘI DUNG ── */}
        <div className="p-6">
          {/* Tiêu đề + Giá */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">{room.title}</h2>
            <p className="text-2xl font-extrabold text-blue-600 whitespace-nowrap">{room.price}</p>
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <div>
                <span className="font-medium text-gray-700">Địa chỉ:</span>{" "}
                {room.address}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>🔍</span>
              <span className="font-medium text-gray-700">Trạng thái:</span>
              <span className={`font-semibold ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                {room.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span className="font-medium text-gray-700">Giá thuê:</span>
              <span className="font-semibold text-blue-600">{room.price}</span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-3">
            {/* Copy gửi khách — hiện với mọi người */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                border transition-all duration-200 cursor-pointer
                ${copied
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400"
                }`}
            >
              {copied ? "✅ Đã copy!" : "📋 Copy gửi khách"}
            </button>

            {/* Nút Admin: Chỉnh sửa + Xóa */}
            {isAdmin && (
              <>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-amber-50 text-amber-600 border border-amber-300
                    hover:bg-amber-100 transition-colors cursor-pointer"
                  onClick={() => alert("🚧 Tính năng Chỉnh sửa sẽ được phát triển ở bước tiếp theo!")}
                >
                  ✏️ Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-red-50 text-red-500 border border-red-300
                    hover:bg-red-100 transition-colors cursor-pointer"
                >
                  🗑 Xóa phòng
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomModal;
