package com.Api.Abode.service;

import com.Api.Abode.dto.RoomDto;
import com.Api.Abode.model.Room;
import com.Api.Abode.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    @Transactional
    public RoomDto save(RoomDto roomDto) {
        Room save = roomRepository.save(mapRoomDto(roomDto));
        roomDto.setId(save.getId());
        return roomDto;
    }

    @Transactional(readOnly = true)
    public List<RoomDto> getAll() {
        return roomRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private Room mapRoomDto(RoomDto roomDto) {
        return Room.builder().name(roomDto.getName())
                .description(roomDto.getDescription())
                .createdDate(Instant.now())
                .build();
    }

    private RoomDto mapToDto(Room room) {
        return RoomDto.builder().name(room.getName())
                .id(room.getId())
                .description(room.getDescription())
                .numberOfPosts(room.getPosts().size())
                .build();
    }
}