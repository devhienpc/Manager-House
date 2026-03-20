// src/utils/cloudinary.js

/**
 * Tối ưu hoá đường dẫn ảnh Cloudinary
 * 
 * @param {string} url - Đường dẫn ban đầu từ DB
 * @param {string} type - 'card' (ảnh nhỏ) hoặc 'modal' (ảnh to)
 * @returns {string} - Đường dẫn đã chèn các tham số tối ưu (Transformations)
 */
export const getOptimizedImageUrl = (url, type = "card") => {
  // Chỉ xử lý nếu đúng là link của cloudinary
  if (!url || !url.includes("cloudinary.com/")) {
    return url;
  }

  // Nếu link đã có chứa upload/ kèm theo tham số tối ưu (chứa w_ hoặc q_auto), thì bỏ qua
  if (url.includes("/upload/w_") || url.includes("q_auto")) {
    return url;
  }

  // Định nghĩa các tham số nén tương ứng
  const transformations = type === "card"
    ? "w_400,c_fill,g_auto,q_auto:best"
    : "w_1200,c_limit,q_auto:best";

  // Chèn transformation ngay sau chữ "/upload/"
  return url.replace("/upload/", `/upload/${transformations}/`);
};
