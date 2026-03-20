import { useState } from "react";
import axios from "axios";

// ==========================================
// GIÁ TRỊ MẶC ĐỊNH CỦA FORM (để reset dễ)
// ==========================================
const EMPTY_FORM = {
  title: "",
  priceNumber: "",
  realAddress: "",    // Địa chỉ thật — chỉ Admin thấy
  displayAddress: "", // Địa chỉ giả — hiện công khai
  imageList: "",      // Chuỗi nhiều link, cách nhau bởi dấu phẩy
  status: "Còn trống",
};

// ==========================================
// COMPONENT: AddRoomForm (Modal)
// ==========================================
function AddRoomForm({ onAddRoom, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim())
      newErrors.title = "Vui lòng nhập tên phòng.";
    if (!form.priceNumber || isNaN(form.priceNumber) || Number(form.priceNumber) <= 0)
      newErrors.priceNumber = "Vui lòng nhập giá hợp lệ (số > 0).";
    if (!form.realAddress.trim())
      newErrors.realAddress = "Vui lòng nhập địa chỉ thật.";
    if (!form.displayAddress.trim())
      newErrors.displayAddress = "Vui lòng nhập địa chỉ hiển thị công khai.";
    if (!form.imageList.trim())
      newErrors.imageList = "Vui lòng nhập ít nhất 1 link ảnh.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const priceNum = Number(form.priceNumber);

    // Tách chuỗi link ảnh bằng dấu phẩy → mảng, bỏ khoảng trắng thừa
    const imageUrls = form.imageList
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // Payload gửi lên Backend theo cấu trúc mới
    const newRoomPayload = {
      title:          form.title.trim(),
      price:          priceNum.toLocaleString("vi-VN") + "đ / tháng",
      status:         form.status,
      realAddress:    form.realAddress.trim(),
      displayAddress: form.displayAddress.trim(),
      imageUrls,          // List<String> — backend đã hỗ trợ
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/rooms`,
        newRoomPayload
      );

      const savedRoom = response.data;

      // Callback lên RoomList — map lại để UI tương thích
      onAddRoom({
        ...savedRoom,
        image: savedRoom.imageUrls?.[0] ?? "",   // Ảnh đầu tiên làm thumbnail
        priceNumber: priceNum,
      });

      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      console.error("=== LỖI KHI GỌI API ===");
      console.error(error);
      if (error.response) {
        console.error("HTTP Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      alert("Lỗi khi thêm phòng! Nhấn F12 → Console để xem chi tiết.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-fade-in overflow-y-auto max-h-[90vh]"
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

          {/* Giá */}
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

          {/* Địa chỉ thật — bảo mật */}
          <Field
            label={
              <span>
                🔒 Địa chỉ thật{" "}
                <span className="text-red-500 font-normal text-xs">(Bảo mật — chỉ Admin thấy)</span>
              </span>
            }
            error={errors.realAddress}
          >
            <input
              type="text"
              name="realAddress"
              value={form.realAddress}
              onChange={handleChange}
              placeholder="VD: 123 Lý Tự Trọng, P. Bến Nghé, Q.1, TP.HCM"
              className={inputClass(errors.realAddress)}
            />
          </Field>

          {/* Địa chỉ hiển thị — công khai */}
          <Field
            label={
              <span>
                🌐 Địa chỉ hiển thị{" "}
                <span className="text-green-600 font-normal text-xs">(Công khai cho khách xem)</span>
              </span>
            }
            error={errors.displayAddress}
          >
            <input
              type="text"
              name="displayAddress"
              value={form.displayAddress}
              onChange={handleChange}
              placeholder="VD: Khu vực Quận 1, gần Bến Thành"
              className={inputClass(errors.displayAddress)}
            />
          </Field>

          {/* Gallery ảnh — dán nhiều link cách nhau bởi dấu phẩy */}
          <Field
            label={
              <span>
                📷 Danh sách link ảnh{" "}
                <span className="text-gray-400 font-normal text-xs">(Dán link Telegram, cách nhau bởi dấu phẩy)</span>
              </span>
            }
            error={errors.imageList}
          >
            <textarea
              name="imageList"
              value={form.imageList}
              onChange={handleChange}
              rows={4}
              placeholder={"https://t.me/link1,\nhttps://t.me/link2,\nhttps://t.me/link3"}
              className={`${inputClass(errors.imageList)} resize-none`}
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
              className="flex-1 py-2 rounded-lg bg-[#FF7E5F] text-white text-sm font-semibold hover:bg-[#e8694d] transition-colors cursor-pointer"
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

function inputClass(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors
    ${error
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-300 focus:ring-[#FF7E5F]/50"
    }`;
}

export default AddRoomForm;
