package com.example.backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
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
@Table(name = "services")
public class PortalService {
    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String nameRu;
    private String nameEn;
    private String category;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String descriptionRu;
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;
    private String department;
    private String link;
    private String phone;
    private String email;
    private String icon;
    private Integer orderNumber;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (orderNumber == null) orderNumber = 0;
        if (isActive == null) isActive = true;
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        if (orderNumber == null) orderNumber = 0;
        if (isActive == null) isActive = true;
        updatedAt = LocalDateTime.now();
    }
}
