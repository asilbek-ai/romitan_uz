package com.example.backend.Services.PortalDocumentService;

import com.example.backend.DTO.PortalDocumentDTO;

import java.util.List;
import java.util.UUID;

public interface PortalDocumentService {
    List<PortalDocumentDTO> getAll();
    PortalDocumentDTO getById(UUID id);
    PortalDocumentDTO create(PortalDocumentDTO dto);
    PortalDocumentDTO update(UUID id, PortalDocumentDTO dto);
    void delete(UUID id);
    PortalDocumentDTO incrementDownloadCount(UUID id);
}
