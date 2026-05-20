package com.Api.Abode.controller;

import com.Api.Abode.dto.RoomDto;
import com.Api.Abode.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomDto roomDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomService.save(roomDto));
    }

    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(roomService.getAll());
    }
}