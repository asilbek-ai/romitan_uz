package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PortalDocumentDTO {
    private UUID id;
    private String title;
    private String titleRu;
    private String titleEn;
    private String type;
    private Integer year;
    private String fileUrl;
    private UUID fileId;
    private String fileName;
    private Long fileSize;
    private String description;
    private String descriptionRu;
    private String descriptionEn;
    private Long downloadCount;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
