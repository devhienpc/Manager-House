package com.devhienpc.demo.dto;

import java.util.List;

/**
 * DTO dành cho khách (Guest) chưa đăng nhập.
 * Chỉ trả về thông tin công khai — KHÔNG có realAddress.
 */
public class RoomPublicDTO {
    private Long id;
    private String title;
    private String price;
    private String status;
    private String displayAddress;  // Địa chỉ giả, công khai
    private List<String> imageUrls; // Toàn bộ ảnh

    public RoomPublicDTO(Long id, String title, String price, String status,
                         String displayAddress, List<String> imageUrls) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.status = status;
        this.displayAddress = displayAddress;
        this.imageUrls = imageUrls;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPrice() { return price; }
    public String getStatus() { return status; }
    public String getDisplayAddress() { return displayAddress; }
    public List<String> getImageUrls() { return imageUrls; }
}
