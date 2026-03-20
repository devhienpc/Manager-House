package com.devhienpc.demo.dto;

import java.util.List;

/**
 * DTO đầy đủ dành cho Admin đã đăng nhập.
 * Trả về tất cả trường kể cả realAddress và toàn bộ imageUrls.
 */
public class RoomAdminDTO {
    private Long id;
    private String title;
    private String price;
    private String status;
    private String displayAddress;  // Địa chỉ giả, công khai
    private String realAddress;     // Địa chỉ thật, bảo mật — chỉ Admin thấy
    private List<String> imageUrls; // Toàn bộ gallery ảnh

    public RoomAdminDTO(Long id, String title, String price, String status,
                        String displayAddress, String realAddress, List<String> imageUrls) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.status = status;
        this.displayAddress = displayAddress;
        this.realAddress = realAddress;
        this.imageUrls = imageUrls;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPrice() { return price; }
    public String getStatus() { return status; }
    public String getDisplayAddress() { return displayAddress; }
    public String getRealAddress() { return realAddress; }
    public List<String> getImageUrls() { return imageUrls; }
}
