package com.example.backend.Services.PortalServiceService;

import com.example.backend.DTO.PortalServiceDTO;

import java.util.List;
import java.util.UUID;

public interface PortalServiceService {
    List<PortalServiceDTO> getAll();
    PortalServiceDTO getById(UUID id);
    PortalServiceDTO create(PortalServiceDTO dto);
    PortalServiceDTO update(UUID id, PortalServiceDTO dto);
    void delete(UUID id);
}
