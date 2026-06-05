package com.example.backend.Controller;

import com.example.backend.DTO.PortalServiceDTO;
import com.example.backend.Services.PortalServiceService.PortalServiceService;
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
@RequestMapping({"/api/v1/services", "/api/services"})
public class PortalServiceController {

    private final PortalServiceService portalServiceService;

    @GetMapping
    public ResponseEntity<List<PortalServiceDTO>> getAll() {
        return ResponseEntity.ok(portalServiceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortalServiceDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(portalServiceService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PortalServiceDTO> create(@RequestBody PortalServiceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(portalServiceService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortalServiceDTO> update(@PathVariable UUID id, @RequestBody PortalServiceDTO dto) {
        return ResponseEntity.ok(portalServiceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        portalServiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
