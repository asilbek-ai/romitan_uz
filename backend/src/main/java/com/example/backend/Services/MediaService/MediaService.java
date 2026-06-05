package com.example.backend.Services.MediaService;

import com.example.backend.DTO.MediaDTO;

import java.util.List;
import java.util.UUID;

public interface MediaService {
    List<MediaDTO> getAll();
    MediaDTO getById(UUID id);
    MediaDTO create(MediaDTO dto);
    MediaDTO update(UUID id, MediaDTO dto);
    void delete(UUID id);
}
