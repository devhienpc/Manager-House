package com.devhienpc.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    // Gợi ý: Nếu sau này cần tính toán bộ lọc, bạn có thể tách thêm cột Long priceNumber
    private String price;
    
    private String address;
    private String status;
    
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    // Constructors
    public Room() {
    }

    public Room(String title, String price, String address, String status, String imageUrl) {
        this.title = title;
        this.price = price;
        this.address = address;
        this.status = status;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
