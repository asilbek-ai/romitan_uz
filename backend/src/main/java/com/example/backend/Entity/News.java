package com.example.backend.Entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "news")
public class News {
    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String titleRu;
    private String titleEn;
    private String slug;
    private String imageUrl;
    @ManyToOne
    private Attachment image;
    @Column(columnDefinition = "TEXT")
    private String summary;
    @Column(columnDefinition = "TEXT")
    private String summaryRu;
    @Column(columnDefinition = "TEXT")
    private String summaryEn;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "TEXT")
    private String contentRu;
    @Column(columnDefinition = "TEXT")
    private String contentEn;
    private String author;
    private Long views;
    private Boolean isPublished;
    private LocalDateTime publishedDate;
    @ElementCollection
    @CollectionTable(name = "news_tags", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (views == null) views = 0L;
        if (isPublished == null) isPublished = true;
        if (publishedDate == null) publishedDate = LocalDateTime.now();
        if (isBlank(slug)) slug = generateSlug(title);
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        if (views == null) views = 0L;
        if (isPublished == null) isPublished = true;
        if (publishedDate == null) publishedDate = LocalDateTime.now();
        if (isBlank(slug)) slug = generateSlug(title);
        updatedAt = LocalDateTime.now();
    }

    private static String generateSlug(String value) {
        if (isBlank(value)) return "news-" + System.currentTimeMillis();
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFKD)
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^\\p{L}\\p{N}]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "news-" + System.currentTimeMillis() : normalized;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
