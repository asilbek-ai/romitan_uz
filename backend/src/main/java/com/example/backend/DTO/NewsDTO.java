package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NewsDTO {
    private UUID id;
    private String title;
    private String titleRu;
    private String titleEn;
    private String slug;
    private String imageUrl;
    private UUID imageId;
    private String summary;
    private String summaryRu;
    private String summaryEn;
    private String content;
    private String contentRu;
    private String contentEn;
    private String author;
    private Long views;
    private Boolean isPublished;
    private LocalDateTime publishedDate;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
