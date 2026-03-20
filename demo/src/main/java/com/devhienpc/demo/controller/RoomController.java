package com.devhienpc.demo.controller;

import com.devhienpc.demo.dto.RoomAdminDTO;
import com.devhienpc.demo.dto.RoomPublicDTO;
import com.devhienpc.demo.entity.Room;
import com.devhienpc.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // Secret token được cấu hình qua biến môi trường ADMIN_TOKEN (đặt trên Render)
    // Mặc định fallback là "manager-house-secret" nếu chưa set
    @Value("${admin.token:manager-house-secret}")
    private String adminToken;

    // ─────────────────────────────────────────────────────────────
    // 1. GET /api/rooms — Phân quyền Admin / Guest
    // ─────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllRooms(
            @RequestHeader(value = "X-Admin-Token", required = false) String token) {

        List<Room> rooms = roomRepository.findAll();

        if (adminToken.equals(token)) {
            // ── ADMIN: trả đầy đủ tất cả trường ─────────────────
            List<RoomAdminDTO> adminDTOs = rooms.stream()
                    .map(r -> new RoomAdminDTO(
                            r.getId(),
                            r.getTitle(),
                            r.getPrice(),
                            r.getStatus(),
                            r.getDisplayAddress(),
                            r.getRealAddress(),     // Địa chỉ thật — chỉ Admin thấy
                            r.getImageUrls()        // Toàn bộ gallery
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(adminDTOs);

        } else {
            // ── GUEST: chỉ trả thông tin công khai ───────────────
            List<RoomPublicDTO> publicDTOs = rooms.stream()
                    .map(r -> new RoomPublicDTO(
                            r.getId(),
                            r.getTitle(),
                            r.getPrice(),
                            r.getStatus(),
                            r.getDisplayAddress(),  // Địa chỉ giả
                            r.getImageUrls() != null && !r.getImageUrls().isEmpty()
                                    ? r.getImageUrls().get(0)   // Chỉ ảnh đầu tiên
                                    : null
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(publicDTOs);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. POST /api/rooms — Tạo phòng mới
    // ─────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. PUT /api/rooms/{id} — Sửa thông tin phòng
    // ─────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            room.setTitle(roomDetails.getTitle());
            room.setPrice(roomDetails.getPrice());
            room.setStatus(roomDetails.getStatus());
            room.setDisplayAddress(roomDetails.getDisplayAddress());
            room.setRealAddress(roomDetails.getRealAddress());
            room.setImageUrls(roomDetails.getImageUrls());
            Room updatedRoom = roomRepository.save(room);
            return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ─────────────────────────────────────────────────────────────
    // 4. DELETE /api/rooms/{id} — Xóa phòng
    // ─────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteRoom(@PathVariable Long id) {
        try {
            roomRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
