// src/components/RoomList.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddRoomForm from "./AddRoomForm";
import RoomModal from "./RoomModal";

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
// 1. DỮ LIỆU MẪU — có mảng images[] nhiều ảnh
// ==========================================
const INITIAL_ROOMS = [
  {
    id: 1,
    title: "Phòng trọ cao cấp Quận 1",
    priceNumber: 3500000,
    price: "3.500.000đ / tháng",
    address: "123 Lý Tự Trọng, Quận 1, TP.HCM",
    status: "Còn trống",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Phòng trọ mini Bình Thạnh",
    priceNumber: 2800000,
    price: "2.800.000đ / tháng",
    address: "45 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    status: "Đã chốt",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 3,
    title: "Phòng trọ tiện nghi Thủ Đức",
    priceNumber: 2200000,
    price: "2.200.000đ / tháng",
    address: "78 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
    status: "Còn trống",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop",
    ],
  },
  {
    id: 4,
    title: "Phòng trọ view đẹp Quận 7",
    priceNumber: 5500000,
    price: "5.500.000đ / tháng",
    address: "90 Nguyễn Thị Thập, Quận 7, TP.HCM",
    status: "Còn trống",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop",
    ],
  },
];

// ==========================================
// 2. CẤU HÌNH BỘ LỌC GIÁ
// ==========================================
const PRICE_FILTERS = [
  { label: "Tất cả", key: "all" },
  { label: "< 3 triệu", key: "lt3" },
  { label: "3 - 5 triệu", key: "3to5" },
  { label: "> 5 triệu", key: "gt5" },
];

function matchesPrice(room, priceKey) {
  if (priceKey === "all") return true;
  if (priceKey === "lt3") return room.priceNumber < 3000000;
  if (priceKey === "3to5") return room.priceNumber >= 3000000 && room.priceNumber <= 5000000;
  if (priceKey === "gt5") return room.priceNumber > 5000000;
  return true;
}

// ==========================================
// 3. COMPONENT: FilterBar
// ==========================================
function FilterBar({ priceFilter, setPriceFilter, onlyAvailable, setOnlyAvailable }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {PRICE_FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => setPriceFilter(f.key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer
            ${priceFilter === f.key
              ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500"
            }`}
        >
          {f.label}
        </button>
      ))}
      <button
        onClick={() => setOnlyAvailable((p) => !p)}
        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer
          ${onlyAvailable
            ? "bg-green-500 text-white border-green-500 shadow-md scale-105"
            : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-500"
          }`}
      >
        ✅ Còn trống
      </button>
    </div>
  );
}

// ==========================================
// 4. COMPONENT: RoomCard — SHOP-GAME TILE
//    Bấm vào bất cứ đâu → mở RoomModal
// ==========================================
function RoomCard({ room, onClick }) {
  const isAvailable = room.status === "Còn trống";

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Ảnh — h-48 w-full object-cover để tất cả ảnh bằng nhau */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay dưới ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badge trạng thái trên ảnh */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow
            ${isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {room.status}
        </span>

        {/* Số ảnh nếu có nhiều hơn 1 */}
        {room.images?.length > 1 && (
          <span className="absolute bottom-2 right-3 text-white/80 text-xs">
            📷 {room.images.length} ảnh
          </span>
        )}
      </div>

      {/* Thông tin phòng */}
      <div className="p-4">
        <p className="text-blue-600 font-extrabold text-lg leading-tight mb-1">
          {room.price}
        </p>
        <h3 className="text-gray-800 font-semibold text-sm leading-snug mb-1 line-clamp-2">
          {room.title}
        </h3>
        <p className="text-gray-400 text-xs truncate">📍 {room.address}</p>
      </div>

      {/* Thanh màu dưới cùng — thay đổi theo trạng thái */}
      <div className={`h-1 w-full ${isAvailable ? "bg-green-400" : "bg-red-400"}`} />
    </div>
  );
}

// ==========================================
// 5. COMPONENT CHÍNH: RoomList
// ==========================================
function RoomList() {
  const { isLoggedIn } = useAuth();
  const isAdmin = isLoggedIn;

  const [roomList, setRoomList] = useState(INITIAL_ROOMS);
  const [priceFilter, setPriceFilter] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  // State lưu phòng đang được xem chi tiết (null = không mở Modal)
  const [selectedRoom, setSelectedRoom] = useState(null);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleAddRoom = (newRoom) => {
    setRoomList((prev) => [newRoom, ...prev]);
    setShowAddForm(false);
  };

  const handleDeleteRoom = (id) => {
    setRoomList((prev) => prev.filter((r) => r.id !== id));
    setSelectedRoom(null); // Đóng modal sau khi xóa
  };

  const filteredRooms = roomList.filter((room) => {
    const priceMatch = matchesPrice(room, priceFilter);
    const statusMatch = onlyAvailable ? room.status === "Còn trống" : true;
    return priceMatch && statusMatch;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏠 Danh Sách Phòng Trọ</h1>
          <p className="text-gray-400 text-sm mt-1">
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
