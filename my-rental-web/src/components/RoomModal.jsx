// src/components/RoomModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOptimizedImageUrl } from "../utils/cloudinary";
import { Snowflake, Refrigerator, WashingMachine, Clock, Dog, Car, CheckCircle, ChefHat, DoorOpen } from "lucide-react";

const getAmenityIcon = (name) => {
  switch (name) {
    case 'Máy lạnh': return <Snowflake className="w-5 h-5 mx-auto text-blue-500" />;
    case 'Tủ lạnh': return <Refrigerator className="w-5 h-5 mx-auto text-sky-400" />;
    case 'Máy giặt': return <WashingMachine className="w-5 h-5 mx-auto text-indigo-400" />;
    case 'Giờ giấc tự do': return <Clock className="w-5 h-5 mx-auto text-orange-400" />;
    case 'Cho nuôi thú cưng': return <Dog className="w-5 h-5 mx-auto text-amber-600" />;
    case 'Có hầm xe': return <Car className="w-5 h-5 mx-auto text-stone-600 dark:text-gray-300" />;
    case 'Tủ bếp': return <ChefHat className="w-5 h-5 mx-auto text-rose-500" />;
    case 'Tủ đồ': return <DoorOpen className="w-5 h-5 mx-auto text-teal-600" />;
    default: return <CheckCircle className="w-5 h-5 mx-auto text-green-500" />;
  }
};

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
  const [currentIndex, setCurrentIndex] = useState(0); // Vị trí ảnh đang hiển thị
  const [touchStart, setTouchStart]   = useState(null);
  const [touchEnd, setTouchEnd]       = useState(null);
  const [copied, setCopied]           = useState(false);
  const [isEditing, setIsEditing]     = useState(false);
  const [editStatus, setEditStatus]   = useState(room.status);

  // ── Xử lý vuốt ảnh (Swipe) trên điện thoại ──────────────────────────────
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || images.length <= 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); // Vuốt trái -> next
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); // Vuốt phải -> prev
    }
  };

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
          className="relative bg-[var(--card-bg)]/95 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[var(--border-subtle)] transition-colors duration-300"
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

          {/* ── ẢNH ĐẦU TIÊN (hero / slider) ──────────────────────── */}
          {images.length > 0 && (
            <div 
              className="relative group overflow-hidden rounded-t-2xl h-64 sm:h-80 flex items-center justify-center bg-black/5"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                key={currentIndex}
                src={getOptimizedImageUrl(images[currentIndex], "modal")}
                alt={`${room.title} - ảnh ${currentIndex + 1}`}
                loading="lazy"
                className="w-full h-full object-cover cursor-pointer animate-[fadeIn_0.4s_ease-in-out]"
                onClick={() => setLightboxImg(images[currentIndex])}
              />
              
              <span
                className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-semibold shadow z-20
                  ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
              >
                {room.status}
              </span>

              {/* Số thứ tự ảnh */}
              {images.length > 1 && (
                <span className="absolute top-3 right-3 bg-black/50 text-white text-sm font-medium px-2.5 py-1 rounded-full z-20 shadow-sm backdrop-blur-sm">
                  {currentIndex + 1} / {images.length}
                </span>
              )}

              {/* Nút điều hướng Slider */}
              {images.length > 1 && (
                <>
                  {/* Nút Trái */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                    }}
                    className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer backdrop-blur-sm shadow-md"
                    aria-label="Ảnh trước"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  {/* Nút Phải */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer backdrop-blur-sm shadow-md"
                    aria-label="Ảnh tiếp theo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
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
                    <img src={getOptimizedImageUrl(img, "card")} alt={`Ảnh ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
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
              <h2 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">{room.title}</h2>
              <p className="text-2xl font-extrabold text-blue-600 whitespace-nowrap">{room.price}</p>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3 text-sm text-[var(--text-secondary)] mb-6">

              {/* Địa chỉ công khai — tất cả đều thấy */}
              <div className="flex items-start gap-2">
                <span className="mt-0.5 select-none">📍</span>
                <div>
                  <span className="font-medium text-[var(--text-primary)]">Khu vực: </span>
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
                <span className="font-medium text-[var(--text-primary)]">Trạng thái:</span>
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
                <span className="font-medium text-[var(--text-primary)]">Giá thuê:</span>
                <span className="font-semibold text-blue-600">{room.price}</span>
              </div>
            </div>

            {/* ---------- NƠI HIỂN THỊ TIỆN ÍCH ---------- */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="mb-6 border-t border-[var(--border-subtle)] pt-5">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                  ✨ Tiện ích nổi bật
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {room.amenities.map(amenity => (
                    <div 
                      key={amenity}
                      className="flex flex-col items-center justify-center p-3 w-[88px] h-[82px] bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-subtle)] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] hover:border-[#FF7E5F]/50 hover:bg-[#FF7E5F]/5 hover:-translate-y-1 transition-all text-center cursor-default"
                    >
                      <div className="mb-1.5 drop-shadow-sm">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-secondary)] leading-tight">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NÚT HÀNH ĐỘNG ──────────────────────────── */}
            <div className="flex flex-wrap gap-3">
              {/* Copy gửi khách */}
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  border transition-all duration-200 cursor-pointer
                  ${copied
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-gray-300/50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400"
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
            src={getOptimizedImageUrl(lightboxImg, "modal")}
            alt="Full size"
            loading="lazy"
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
