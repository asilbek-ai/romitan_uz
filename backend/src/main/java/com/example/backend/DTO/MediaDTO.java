package com.example.backend.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MediaDTO {
    private UUID id;
    private String title;
    private String titleRu;
    private String titleEn;
    private String imageUrl;
    private UUID imageId;
    private String thumbnailUrl;
    private String category;
    private Boolean is360;
    @JsonProperty("order")
    private Integer orderNumber;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
