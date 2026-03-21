// src/components/RoomList.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Heart, Search } from "lucide-react";
import AddRoomForm from "./AddRoomForm";
import RoomModal from "./RoomModal";
import { getOptimizedImageUrl } from "../utils/cloudinary";

// ==========================================
// COMPONENT: Toast
// ==========================================
function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-5 py-3
        rounded-xl shadow-lg text-white text-sm font-semibold bg-gray-800
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      ✅ {message}
    </div>
  );
}

// ==========================================
// 1. DỮ LIỆU ĐƯỢC LOAD TỪ API (Không dùng mock cứng nữa)
// ==========================================

// ==========================================
// 2. CẤU HÌNH BỘ LỌC GIÁ
// ==========================================
const PRICE_FILTERS = [
  { label: "Tất cả", key: "all" },
  { label: "< 3 triệu", key: "lt3" },
  { label: "< 4 triệu", key: "lt4" },
  { label: "> 5 triệu", key: "gt5" },
];

function matchesPrice(room, priceKey) {
  if (priceKey === "all" || !priceKey) return true;
  if (priceKey === "lt3") return room.priceNumber < 3000000;
  if (priceKey === "lt4") return room.priceNumber < 4000000;
  if (priceKey === "gt5") return room.priceNumber > 5000000;
  return true;
}

// ==========================================
// 3. COMPONENT: FilterBar
// ==========================================
function FilterBar({ 
  priceFilter, setPriceFilter, 
  onlyAvailable, setOnlyAvailable, 
  customPrice, setCustomPrice,
  searchQuery, setSearchQuery,
  showFavoritesOnly, setShowFavoritesOnly
}) {
  return (
    <div className="flex flex-col gap-4 mb-8 bg-[var(--card-bg)]/80 backdrop-blur-md p-4 lg:px-6 rounded-2xl shadow-sm border border-[var(--border-subtle)] transition-colors duration-300">
      {/* Hàng 1: Search & Yêu thích */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên phòng, địa chỉ, hoặc tiện ích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full rounded-full text-sm font-medium border border-gray-300 bg-[var(--card-bg)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 dark:border-[var(--border-subtle)]"
          />
        </div>
        
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 cursor-pointer
            ${showFavoritesOnly
              ? "bg-pink-500 text-white border-pink-500 shadow-md scale-105"
              : "bg-[var(--card-bg)] text-pink-500 border-pink-200 hover:bg-pink-50 hover:border-pink-300 dark:hover:bg-pink-900/20"
            }`}
        >
          <Heart size={18} fill={showFavoritesOnly ? "currentColor" : "none"} strokeWidth={2.5} />
          Đã Yêu Thích
        </button>
      </div>

      {/* Hàng 2: Lọc giá và Trạng thái */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border-subtle)] w-full">
      {PRICE_FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => {
            setPriceFilter(f.key);
            setCustomPrice("");
          }}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer
            ${priceFilter === f.key
              ? "bg-[#FF7E5F] text-white border-[#FF7E5F] shadow-md scale-105"
              : "bg-[var(--card-bg)] text-[var(--text-secondary)] border-gray-300/50 hover:border-[#FF7E5F] hover:text-[#FF7E5F]"
            }`}
        >
          {f.label}
        </button>
      ))}

      <input
        type="number"
        placeholder="Nhập giá phòng cần tìm..."
        value={customPrice}
        onChange={(e) => {
          setCustomPrice(e.target.value);
          if (e.target.value !== "") setPriceFilter("");
        }}
        className="px-4 py-2 w-56 rounded-full text-sm font-semibold border border-[#FF7E5F] bg-[var(--card-bg)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#FF7E5F]/50 transition-all duration-200"
      />

      <button
        onClick={() => setOnlyAvailable((p) => !p)}
        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer
          ${onlyAvailable
            ? "bg-green-500 text-white border-green-500 shadow-md scale-105"
            : "bg-[var(--card-bg)] text-[var(--text-secondary)] border-gray-300/50 hover:border-green-400 hover:text-green-500"
          }`}
      >
        Còn trống
      </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. COMPONENT: RoomCard — SHOP-GAME TILE
//    Bấm vào bất cứ đâu → mở RoomModal
// ==========================================
function RoomCard({ room, onClick, isFavorite, onToggleFavorite }) {
  const isAvailable = room.status === "Còn trống";

  // Hỗ trợ cả dữ liệu mới (imageUrls) và cũ (image)
  const thumbnail =
    room.imageUrls?.length > 0
      ? room.imageUrls[0]
      : room.firstImageUrl || room.image || "";

  const totalImages =
    room.imageUrls?.length ?? room.images?.length ?? 0;

  const address = room.displayAddress || room.address || "";
  const optimizedThumbnail = getOptimizedImageUrl(thumbnail, "card");

  return (
    <div
      onClick={onClick}
      className="group bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border-subtle)] cursor-pointer
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
    >
      {/* Ảnh thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={optimizedThumbnail}
          alt={room.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Nút thả tim */}
        <button
          onClick={(e) => onToggleFavorite(e, room.id)}
          className={`absolute top-3 left-3 p-1.5 rounded-full shadow-md transition-all duration-300 hover:scale-110 z-10
            ${isFavorite ? "bg-white text-pink-500" : "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"}`}
          title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Badge trạng thái */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow
            ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {room.status}
        </span>

        {/* Badge số ảnh */}
        {totalImages > 1 && (
          <span className="absolute bottom-2 right-3 text-white/80 text-xs">
            📷 {totalImages} ảnh
          </span>
        )}
      </div>

      {/* Thông tin phòng */}
      <div className="p-4">
        <p className="text-blue-600 font-extrabold text-lg leading-tight mb-1">
          {room.price}
        </p>
        <h3 className="text-[var(--text-primary)] font-semibold text-sm leading-snug mb-1 line-clamp-2">
          {room.title}
        </h3>
        <p className="text-gray-400 text-xs truncate">📍 {address || "—"}</p>
      </div>

      {/* Thanh màu dưới cùng — thay đổi theo trạng thái, tăng độ dày để làm điểm nhấn */}
      <div className={`h-1.5 w-full ${isAvailable ? "bg-green-500 shadow-[0_-2px_4px_rgba(34,197,94,0.3)]" : "bg-red-500 shadow-[0_-2px_4px_rgba(239,68,68,0.3)]"}`} />
    </div>
  );
}

// ==========================================
// 5. COMPONENT CHÍNH: RoomList
// ==========================================
function RoomList() {
  const { isLoggedIn } = useAuth();
  const isAdmin = isLoggedIn;

  // Token xác thực Admin — khớp với biến môi trường ADMIN_TOKEN trên Render
  const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "manager-house-secret";

  const [roomList, setRoomList] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [customPrice, setCustomPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteRooms");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteRooms", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e, roomId) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  // Lấy dữ liệu từ Backend khi load trang
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Gửi header X-Admin-Token khi đã đăng nhập — backend sẽ trả data đầy đủ kể cả realAddress
        const headers = isAdmin ? { "X-Admin-Token": ADMIN_TOKEN } : {};
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/rooms`,
          { headers }
        );
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();

        const mappedData = data.map(r => {
          const priceNum = parseInt((r.price || "").replace(/\D/g, "")) || 0;
          // Hỗ trợ cả cấu trúc mới (imageUrls, firstImageUrl) và cũ (imageUrl)
          const thumbnail =
            r.imageUrls?.[0] ?? r.firstImageUrl ?? r.imageUrl ?? "";
          return {
            ...r,
            image: thumbnail,         // thumbnail cho RoomCard
            priceNumber: priceNum,    // số thực để bộ lọc giá hoạt động
          };
        });

        setRoomList(mappedData.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error("Lỗi lấy danh sách phòng:", err);
      }
    };
    fetchRooms();
  }, [isAdmin]);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddRoom = (newRoom) => {
    setRoomList((prev) => [newRoom, ...prev]);
    setShowAddForm(false);
  };

  const handleUpdateRoom = (updatedRoom) => {
    setRoomList((prev) => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom); // Cập nhật luôn UI modal
  };

  const handleDeleteRoom = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/rooms/${id}`, { method: "DELETE" });
      if (response.ok) {
        setRoomList((prev) => prev.filter((r) => r.id !== id));
        setSelectedRoom(null); // Đóng modal sau khi xóa
      }
    } catch (err) {
      console.error("Lỗi xóa phòng:", err);
    }
  };

  const filteredRooms = roomList.filter((room) => {
    let priceMatch = true;
    if (customPrice && !isNaN(customPrice)) {
      const targetPrice = parseInt(customPrice, 10);
      priceMatch = room.priceNumber >= targetPrice - 100000 && room.priceNumber <= targetPrice + 100000;
    } else {
      priceMatch = matchesPrice(room, priceFilter);
    }

    const statusMatch = onlyAvailable ? room.status === "Còn trống" : true;

    let searchMatch = true;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const titleMatch = room.title?.toLowerCase().includes(q);
      const addressMatch = room.displayAddress?.toLowerCase().includes(q) || room.address?.toLowerCase().includes(q);
      const amenitiesMatch = room.amenities?.some(a => a.toLowerCase().includes(q));
      searchMatch = titleMatch || addressMatch || amenitiesMatch;
    }

    const favoriteMatch = showFavoritesOnly ? favorites.includes(room.id) : true;

    return priceMatch && statusMatch && searchMatch && favoriteMatch;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] transition-colors duration-300">Danh Sách Phòng Trọ</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1 transition-colors duration-300">
            Hiển thị <span className="font-semibold text-gray-600">{filteredRooms.length}</span>
            /{roomList.length} phòng
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white
              text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors
              cursor-pointer shadow-lg shadow-blue-200"
          >
            ➕ Thêm phòng
          </button>
        )}
      </div>

      {/* ── FILTER BAR ── */}
      <div className="mt-6">
        <FilterBar
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          onlyAvailable={onlyAvailable}
          setOnlyAvailable={setOnlyAvailable}
          customPrice={customPrice}
          setCustomPrice={setCustomPrice}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
        />
      </div>

      {/* ── SHOP GAME GRID ── */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => setSelectedRoom(room)}
              isFavorite={favorites.includes(room.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">Không tìm thấy phòng phù hợp.</p>
          <p className="text-sm">Hãy thử chọn bộ lọc khác!</p>
        </div>
      )}

      {/* ── ROOM DETAIL MODAL ── */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onDelete={handleDeleteRoom}
          onUpdate={handleUpdateRoom}
          onCopy={showToast}
        />
      )}

      {/* ── ADD ROOM FORM MODAL ── */}
      {showAddForm && (
        <AddRoomForm
          onAddRoom={handleAddRoom}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* ── TOAST ── */}
      <Toast message="Đã sao chép thông tin phòng!" visible={toastVisible} />
    </div>
  );
}

export default RoomList;
