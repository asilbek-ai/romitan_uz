package com.example.backend.Services.PortalDocumentService;

import com.example.backend.DTO.PortalDocumentDTO;
import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.PortalDocument;
import com.example.backend.Repository.AttachmentRepo;
import com.example.backend.Repository.PortalDocumentRepo;
import com.example.backend.Services.AttachmentService.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortalDocumentServiceImpl implements PortalDocumentService {

    private final PortalDocumentRepo portalDocumentRepo;
    private final AttachmentRepo attachmentRepo;
    private final AttachmentService attachmentService;

    @Override
    public List<PortalDocumentDTO> getAll() {
        return portalDocumentRepo.findAllByIsPublishedTrueOrderByYearDescCreatedAtDesc().stream().map(this::toDto).toList();
    }

    @Override
    public PortalDocumentDTO getById(UUID id) {
        return toDto(findById(id));
    }

    @Override
    public PortalDocumentDTO create(PortalDocumentDTO dto) {
        PortalDocument portalDocument = new PortalDocument();
        copyToEntity(dto, portalDocument);
        return toDto(portalDocumentRepo.save(portalDocument));
    }

    @Override
    public PortalDocumentDTO update(UUID id, PortalDocumentDTO dto) {
        PortalDocument portalDocument = findById(id);
        copyToEntity(dto, portalDocument);
        return toDto(portalDocumentRepo.save(portalDocument));
    }

    @Override
    public void delete(UUID id) {
        if (!portalDocumentRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found");
        }
        portalDocumentRepo.deleteById(id);
    }

    @Override
    public PortalDocumentDTO incrementDownloadCount(UUID id) {
        PortalDocument portalDocument = findById(id);
        Long currentCount = portalDocument.getDownloadCount() == null ? 0L : portalDocument.getDownloadCount();
        portalDocument.setDownloadCount(currentCount + 1);
        return toDto(portalDocumentRepo.save(portalDocument));
    }

    private PortalDocument findById(UUID id) {
        return portalDocumentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));
    }

    private void copyToEntity(PortalDocumentDTO dto, PortalDocument portalDocument) {
        portalDocument.setTitle(dto.getTitle());
        portalDocument.setTitleRu(dto.getTitleRu());
        portalDocument.setTitleEn(dto.getTitleEn());
        portalDocument.setType(dto.getType());
        portalDocument.setYear(dto.getYear());
        portalDocument.setFileUrl(dto.getFileUrl());
        if (dto.getFileId() != null) {
            Attachment file = attachmentRepo.findById(dto.getFileId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
            portalDocument.setFile(file);
        }
        portalDocument.setDescription(dto.getDescription());
        portalDocument.setDescriptionRu(dto.getDescriptionRu());
        portalDocument.setDescriptionEn(dto.getDescriptionEn());
        portalDocument.setDownloadCount(dto.getDownloadCount());
        portalDocument.setIsPublished(dto.getIsPublished());
    }

    private PortalDocumentDTO toDto(PortalDocument portalDocument) {
        Attachment file = portalDocument.getFile();
        String fileUrl = file != null ? attachmentService.getFileUrl(file.getId()) : portalDocument.getFileUrl();
        return new PortalDocumentDTO(
                portalDocument.getId(),
                portalDocument.getTitle(),
                portalDocument.getTitleRu(),
                portalDocument.getTitleEn(),
                portalDocument.getType(),
                portalDocument.getYear(),
                fileUrl,
                file != null ? file.getId() : null,
                file != null ? file.getOriginalName() : null,
                file != null ? file.getSize() : null,
                portalDocument.getDescription(),
                portalDocument.getDescriptionRu(),
                portalDocument.getDescriptionEn(),
                portalDocument.getDownloadCount(),
                portalDocument.getIsPublished(),
                portalDocument.getCreatedAt(),
                portalDocument.getUpdatedAt()
        );
    }
}
