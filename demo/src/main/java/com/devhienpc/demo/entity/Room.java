package com.devhienpc.demo.entity;

import com.devhienpc.demo.converter.StringListConverter;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String price;

    private String status;

    // ── Địa chỉ bảo mật 2 lớp ──────────────────────────────
    @Column(name = "display_address", columnDefinition = "TEXT")
    private String displayAddress;  // Địa chỉ giả, hiển thị công khai

    @Column(name = "real_address", columnDefinition = "TEXT")
    private String realAddress;     // Địa chỉ thật, chỉ Admin thấy

    // ── Gallery nhiều ảnh ───────────────────────────────────
    // Lưu dưới dạng JSON TEXT: ["url1","url2","url3"]
    @Convert(converter = StringListConverter.class)
    @Column(name = "image_urls", columnDefinition = "TEXT")
    private List<String> imageUrls = new ArrayList<>();

    // ── Constructors ────────────────────────────────────────
    public Room() {}

    public Room(String title, String price, String status,
                String displayAddress, String realAddress, List<String> imageUrls) {
        this.title = title;
        this.price = price;
        this.status = status;
        this.displayAddress = displayAddress;
        this.realAddress = realAddress;
        this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
    }

    // ── Getters & Setters ────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDisplayAddress() { return displayAddress; }
    public void setDisplayAddress(String displayAddress) { this.displayAddress = displayAddress; }

    public String getRealAddress() { return realAddress; }
    public void setRealAddress(String realAddress) { this.realAddress = realAddress; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
