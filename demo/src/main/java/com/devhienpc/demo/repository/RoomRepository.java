package com.devhienpc.demo.repository;

import com.devhienpc.demo.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // JpaRepository đã cung cấp sắn các hàm: findAll(), save(), findById(), deleteById()...
}
