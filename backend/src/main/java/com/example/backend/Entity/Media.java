package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "media")
public class Media {
    @Id
    @GeneratedValue
    private UUID id;
    @ManyToOne
    private Attachment image;
    private String title;
    private String titleRu;
    private String titleEn;
    private String imageUrl;
    private String thumbnailUrl;
    private String category;
    private Boolean is360;
    private Integer orderNumber;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (is360 == null) is360 = false;
        if (orderNumber == null) orderNumber = 0;
        if (isPublished == null) isPublished = true;
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        if (is360 == null) is360 = false;
        if (orderNumber == null) orderNumber = 0;
        if (isPublished == null) isPublished = true;
        updatedAt = LocalDateTime.now();
    }
}
