// src/components/RoomModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function RoomModal({ room, onClose, onDelete, onUpdate, onCopy }) {
  const { isLoggedIn } = useAuth();
  const isAdmin = isLoggedIn;
  const isAvailable = room.status === "Còn trống";

  // ── Chuẩn hóa mảng ảnh ─────────────────────────────────
  // Hỗ trợ cả cấu trúc mới (imageUrls) và cũ (images / image)
  const images =
    room.imageUrls?.length > 0
      ? room.imageUrls
      : room.images?.length > 0
      ? room.images
      : room.image
      ? [room.image]
      : [];

  const [lightboxImg, setLightboxImg] = useState(null); // null = đóng lightbox
  const [copied, setCopied]           = useState(false);
  const [isEditing, setIsEditing]     = useState(false);
  const [editStatus, setEditStatus]   = useState(room.status);

  // ── Copy thông tin gửi khách ────────────────────────────
  const handleCopy = () => {
    const text =
      `${room.title}\n` +
      `📍 Khu vực: ${room.displayAddress || room.address || ""}\n` +
      `💰 Giá: ${room.price}\n` +
      `📸 Ảnh: ${images[0] ?? ""}\n` +
      `🔍 Trạng thái: ${room.status}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onCopy();
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
    <>
      {/* ── BACKDROP ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        onClick={onClose}
      >
        {/* ── MODAL BOX ─────────────────────────────────── */}
        <div
          className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/60"
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

          {/* ── ẢNH ĐẦU TIÊN (hero) ──────────────────────── */}
          {images.length > 0 && (
            <div className="relative">
              <img
                src={images[0]}
                alt={room.title}
                className="w-full h-64 sm:h-80 object-cover rounded-t-2xl cursor-pointer"
                onClick={() => setLightboxImg(images[0])}
              />
              <span
                className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-semibold shadow
                  ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
              >
                {room.status}
              </span>
              {images.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  📷 {images.length} ảnh
                </span>
              )}
            </div>
          )}

          {/* ── GALLERY LƯỚI (tất cả ảnh còn lại) ───────── */}
          {images.length > 1 && (
            <div className="px-5 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Gallery ảnh
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxImg(img)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer
                      ${i === 0
                        ? "border-[#FF7E5F] ring-1 ring-[#FF7E5F]/50"
                        : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img src={img} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-[#FF7E5F] text-white px-1.5 py-0.5 rounded font-bold">
                        Bìa
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── NỘI DUNG CHI TIẾT ─────────────────────────── */}
          <div className="p-6">
            {/* Tiêu đề + Giá */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">{room.title}</h2>
              <p className="text-2xl font-extrabold text-blue-600 whitespace-nowrap">{room.price}</p>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3 text-sm text-gray-600 mb-6">

              {/* Địa chỉ công khai — tất cả đều thấy */}
              <div className="flex items-start gap-2">
                <span className="mt-0.5 select-none">📍</span>
                <div>
                  <span className="font-medium text-gray-700">Khu vực: </span>
                  {room.displayAddress || room.address || "—"}
                </div>
              </div>

              {/* Địa chỉ thật — CHỈ Admin thấy */}
              {isAdmin && room.realAddress && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <span className="mt-0.5 select-none">🔒</span>
                  <div>
                    <span className="font-semibold text-red-600">Địa chỉ thật (Admin only): </span>
                    <span className="text-red-700 font-medium">{room.realAddress}</span>
                  </div>
                </div>
              )}

              {/* Trạng thái */}
              <div className="flex items-center gap-2">
                <span className="select-none">🔍</span>
                <span className="font-medium text-gray-700">Trạng thái:</span>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="border border-blue-400 rounded-lg px-2 py-1 text-sm outline-none bg-blue-50 text-blue-800 font-semibold"
                  >
                    <option value="Còn trống">Còn trống</option>
                    <option value="Đã chốt">Đã chốt</option>
                  </select>
                ) : (
                  <span className={`font-semibold ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                    {room.status}
                  </span>
                )}
              </div>

              {/* Giá */}
              <div className="flex items-center gap-2">
                <span className="select-none">💰</span>
                <span className="font-medium text-gray-700">Giá thuê:</span>
                <span className="font-semibold text-blue-600">{room.price}</span>
              </div>
            </div>

            {/* ── NÚT HÀNH ĐỘNG ──────────────────────────── */}
            <div className="flex flex-wrap gap-3">
              {/* Copy gửi khách */}
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
                  {isEditing ? (
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-blue-600 text-white border border-blue-600 hover:bg-blue-700
                        transition-colors cursor-pointer shadow-md"
                      onClick={async () => {
                        try {
                          const payload = {
                            ...room,
                            status: editStatus,
                            imageUrls: room.imageUrls || images,
                          };
                          const res = await fetch(
                            `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/rooms/${room.id}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(payload),
                            }
                          );
                          if (!res.ok) throw new Error("Cập nhật lỗi");
                          const data = await res.json();
                          onUpdate({
                            ...data,
                            image: data.imageUrls?.[0] ?? data.imageUrl ?? "",
                            priceNumber: room.priceNumber,
                          });
                          setIsEditing(false);
                        } catch (e) {
                          console.error("API error:", e);
                          alert("Không thể lưu thay đổi.");
                        }
                      }}
                    >
                      💾 Lưu cập nhật
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-amber-50 text-amber-600 border border-amber-300
                        hover:bg-amber-100 transition-colors cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Chỉnh sửa
                    </button>
                  )}
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

      {/* ── LIGHTBOX (phóng to ảnh) ───────────────────────── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="Full size"
            className="max-w-[95vw] max-h-[92vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
              bg-white/20 hover:bg-white/40 text-white rounded-full text-xl font-bold
              transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default RoomModal;
