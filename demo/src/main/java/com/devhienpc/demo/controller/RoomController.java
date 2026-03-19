package com.devhienpc.demo.controller;

import com.devhienpc.demo.entity.Room;
import com.devhienpc.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Cấu hình CORS mở rộng cho phép mọi port frontend truy xuất tránh lỗi khi Vite tự đổi sang 5174, 5175...
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // 1. GET /api/rooms: Lấy toàn bộ danh sách phòng
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    // 2. POST /api/rooms: Lưu 1 phòng mới
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    // 3. PUT /api/rooms/{id}: Sửa thông tin phòng
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            room.setTitle(roomDetails.getTitle());
            room.setPrice(roomDetails.getPrice());
            room.setAddress(roomDetails.getAddress());
            room.setStatus(roomDetails.getStatus());
            room.setImageUrl(roomDetails.getImageUrl());
            Room updatedRoom = roomRepository.save(room);
            return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 4. DELETE /api/rooms/{id}: Xóa phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteRoom(@PathVariable Long id) {
        try {
            roomRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
