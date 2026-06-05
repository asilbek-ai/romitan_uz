package com.example.backend.Services.AttachmentService;

import com.example.backend.DTO.AttachmentDTO;
import com.example.backend.Entity.Attachment;
import com.example.backend.Repository.AttachmentRepo;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {
    private final AttachmentRepo attachmentRepo;

    @Override
    public HttpEntity<?> uploadFile(MultipartFile photo, String prefix) throws IOException {
        if (photo == null || photo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }

        UUID id = UUID.randomUUID();
        String safeOriginalName = photo.getOriginalFilename() == null ? "file" : photo.getOriginalFilename();
        String normalizedPrefix = normalizePrefix(prefix);
        String fileName = id + "_" + safeOriginalName;
        String filePath = "backend/files" + normalizedPrefix + "/" + fileName;

        File file = new File(filePath);
        file.getParentFile().mkdirs();

        try (OutputStream outputStream = new java.io.FileOutputStream(file)) {
            FileCopyUtils.copy(photo.getInputStream(), outputStream);
        }

        Attachment attachment = Attachment.builder()
                .id(id)
                .prefix(normalizedPrefix)
                .name(fileName)
                .originalName(safeOriginalName)
                .contentType(photo.getContentType())
                .size(photo.getSize())
                .build();

        attachmentRepo.save(attachment);
        return ResponseEntity.ok(toDto(attachment));
    }

    @Override
    public void getFile(HttpServletResponse response, UUID id) throws IOException {
        Attachment attachment = attachmentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));

        File file = new File("backend/files" + attachment.getPrefix() + "/" + attachment.getName());
        if (!file.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
        }

        if (attachment.getContentType() != null) {
            response.setContentType(attachment.getContentType());
        }
        if (attachment.getSize() != null) {
            response.setContentLengthLong(attachment.getSize());
        }
        response.setHeader("Content-Disposition", "inline; filename=\"" + attachment.getOriginalName() + "\"");

        FileCopyUtils.copy(new FileInputStream(file), response.getOutputStream());
    }

    @Override
    public String getFileUrl(UUID id) {
        return "/api/v1/file/getFile/" + id;
    }

    private AttachmentDTO toDto(Attachment attachment) {
        return new AttachmentDTO(
                attachment.getId(),
                getFileUrl(attachment.getId()),
                attachment.getOriginalName(),
                attachment.getContentType(),
                attachment.getSize()
        );
    }

    private String normalizePrefix(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            return "/general";
        }
        String normalized = prefix.trim().replace("\\", "/");
        return normalized.startsWith("/") ? normalized : "/" + normalized;
    }
}
