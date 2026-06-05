package com.example.backend.Controller;

import com.example.backend.DTO.MediaDTO;
import com.example.backend.Services.MediaService.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping({"/api/v1/media", "/api/media"})
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<List<MediaDTO>> getAll() {
        return ResponseEntity.ok(mediaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(mediaService.getById(id));
    }

    @PostMapping
    public ResponseEntity<MediaDTO> create(@RequestBody MediaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mediaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaDTO> update(@PathVariable UUID id, @RequestBody MediaDTO dto) {
        return ResponseEntity.ok(mediaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        mediaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
