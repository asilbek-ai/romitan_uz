package com.example.backend.Controller;

import com.example.backend.DTO.PortalDocumentDTO;
import com.example.backend.Services.PortalDocumentService.PortalDocumentService;
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
@RequestMapping({"/api/v1/documents", "/api/documents"})
public class PortalDocumentController {

    private final PortalDocumentService portalDocumentService;

    @GetMapping
    public ResponseEntity<List<PortalDocumentDTO>> getAll() {
        return ResponseEntity.ok(portalDocumentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortalDocumentDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(portalDocumentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PortalDocumentDTO> create(@RequestBody PortalDocumentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(portalDocumentService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortalDocumentDTO> update(@PathVariable UUID id, @RequestBody PortalDocumentDTO dto) {
        return ResponseEntity.ok(portalDocumentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        portalDocumentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<PortalDocumentDTO> incrementDownloadCount(@PathVariable UUID id) {
        return ResponseEntity.ok(portalDocumentService.incrementDownloadCount(id));
    }
}
