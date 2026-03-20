package com.devhienpc.demo.dto;

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
    private String firstImageUrl;   // Chỉ ảnh đầu tiên

    public RoomPublicDTO(Long id, String title, String price, String status,
                         String displayAddress, String firstImageUrl) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.status = status;
        this.displayAddress = displayAddress;
        this.firstImageUrl = firstImageUrl;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPrice() { return price; }
    public String getStatus() { return status; }
    public String getDisplayAddress() { return displayAddress; }
    public String getFirstImageUrl() { return firstImageUrl; }
}
