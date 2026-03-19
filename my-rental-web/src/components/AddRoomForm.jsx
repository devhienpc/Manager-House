// src/components/AddRoomForm.jsx
import { useState } from "react";

// ==========================================
// GIÁ TRỊ MẶC ĐỊNH CỦA FORM (để reset dễ)
// ==========================================
const EMPTY_FORM = {
  title: "",
  priceNumber: "",
  address: "",
  image: "",
  status: "Còn trống",
};

// ==========================================
// COMPONENT: AddRoomForm (Modal)
// ==========================================
function AddRoomForm({ onAddRoom, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Cập nhật từng trường khi người dùng nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường vừa chỉnh
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Kiểm tra dữ liệu trước khi thêm
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim())       newErrors.title = "Vui lòng nhập tên phòng.";
    if (!form.priceNumber || isNaN(form.priceNumber) || Number(form.priceNumber) <= 0)
      newErrors.priceNumber = "Vui lòng nhập giá hợp lệ (số > 0).";
    if (!form.address.trim())     newErrors.address = "Vui lòng nhập địa chỉ.";
    if (!form.image.trim())       newErrors.image = "Vui lòng nhập link ảnh.";
    return newErrors;
  };

  // Xử lý khi nhấn "Thêm phòng"
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tạo object phòng mới
    const priceNum = Number(form.priceNumber);
    const newRoom = {
      id: Date.now(), // ID duy nhất dựa trên thời gian
      title: form.title.trim(),
      priceNumber: priceNum,
      price: priceNum.toLocaleString("vi-VN") + "đ / tháng",
      address: form.address.trim(),
      image: form.image.trim(),
      status: form.status,
    };

    onAddRoom(newRoom);   // Đẩy phòng mới lên RoomList
    setForm(EMPTY_FORM);  // Reset form về trống
    setErrors({});
  };

  return (
    // Lớp nền mờ (Backdrop) — bấm ra ngoài để đóng
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Hộp Modal — ngăn sự kiện click lan ra backdrop */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">🏠 Thêm Phòng Mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer transition-colors"
            aria-label="Đóng"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Tên phòng */}
          <Field label="Tên phòng" error={errors.title}>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="VD: Phòng trọ cao cấp Quận 1"
              className={inputClass(errors.title)}
            />
          </Field>

          {/* Giá (số) */}
          <Field label="Giá thuê (đồng/tháng)" error={errors.priceNumber}>
            <input
              type="number"
              name="priceNumber"
              value={form.priceNumber}
              onChange={handleChange}
              placeholder="VD: 3500000"
              min="0"
              className={inputClass(errors.priceNumber)}
            />
          </Field>

          {/* Địa chỉ */}
          <Field label="Địa chỉ" error={errors.address}>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="VD: 123 Lý Tự Trọng, Quận 1, TP.HCM"
              className={inputClass(errors.address)}
            />
          </Field>

          {/* Link ảnh */}
          <Field label="Link ảnh (URL)" error={errors.image}>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass(errors.image)}
            />
          </Field>

          {/* Trạng thái */}
          <Field label="Trạng thái">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Còn trống">✅ Còn trống</option>
              <option value="Đã chốt">🔴 Đã chốt</option>
            </select>
          </Field>

          {/* Nút bấm */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              ➕ Thêm phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// HELPER: Field wrapper (label + error)
// ==========================================
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Class CSS cho input (thêm viền đỏ khi có lỗi)
function inputClass(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors
    ${error
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-300 focus:ring-blue-400"
    }`;
}

export default AddRoomForm;
