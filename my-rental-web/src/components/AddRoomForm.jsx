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
  status: "Còn trống",
};

const AMENITIES_LIST = [
  'Máy lạnh', 'Tủ lạnh', 'Máy giặt', 
  'Giờ giấc tự do', 'Cho nuôi thú cưng', 'Có hầm xe'
];

// ==========================================
// COMPONENT: AddRoomForm (Modal)
// ==========================================
function AddRoomForm({ onAddRoom, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrls, setImageUrls] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleToggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "star_house_preset");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/draervmpa/image/upload",
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      }
      
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setErrors((prev) => ({ ...prev, imageList: "" }));
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Tải ảnh lên Cloudinary thất bại, vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input để cho phép chọn lại cùng một file
    }
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
    if (imageUrls.length === 0)
      newErrors.imageList = "Vui lòng chọn ít nhất 1 ảnh.";
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

    // Payload gửi lên Backend theo cấu trúc mới
    const newRoomPayload = {
      title:          form.title.trim(),
      price:          priceNum.toLocaleString("vi-VN") + "đ / tháng",
      status:         form.status,
      realAddress:    form.realAddress.trim(),
      displayAddress: form.displayAddress.trim(),
      imageUrls,          // List<String> — backend đã hỗ trợ
      amenities,          // Danh sách tiện ích
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
      setImageUrls([]);
      setAmenities([]);
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

          {/* Gallery ảnh — upload lên Cloudinary */}
          <Field
            label={
              <span>
                📷 Chọn ảnh phòng <span className="text-gray-400 font-normal text-xs">(Có thể chọn nhiều ảnh)</span>
              </span>
            }
            error={errors.imageList}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className={`${inputClass(errors.imageList)} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#FF7E5F]/10 file:text-[#FF7E5F] hover:file:bg-[#FF7E5F]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full`}
            />

            {/* Thông báo đang tải ảnh */}
            {isUploading && (
              <p className="text-sm font-medium text-blue-600 mt-2 flex items-center gap-2 animate-pulse">
                <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                Đang tải ảnh lên (Vui lòng chờ)...
              </p>
            )}

            {/* Danh sách ảnh đã upload */}
            {imageUrls.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative w-20 h-20 shrink-0">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg shadow-sm border" />
                    <button 
                      type="button" 
                      onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer shadow-md"
                      title="Xóa ảnh này"
                    >&times;</button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {/* Tiện ích phòng */}
          <Field label={<span>✨ Tiện ích phòng</span>}>
            <div className="flex flex-wrap gap-2 mt-1">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border cursor-pointer transition-all select-none
                      ${isSelected
                        ? "bg-[#FF7E5F]/10 border-[#FF7E5F] text-[#FF7E5F] shadow-sm"
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#FF7E5F]/50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleToggleAmenity(amenity)}
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                      ${isSelected ? 'bg-[#FF7E5F] border-[#FF7E5F]' : 'border-gray-400 bg-white'}`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {amenity}
                  </label>
                );
              })}
            </div>
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
