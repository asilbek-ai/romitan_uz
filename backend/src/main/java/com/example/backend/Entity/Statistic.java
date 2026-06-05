package com.example.backend.Entity;

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
@Table(name = "statistics")
public class Statistic {
    @Id
    @GeneratedValue
    private UUID id;

    private String label;
    private String labelRu;
    private String labelEn;
    private Long value;
    private String icon;
    private String suffix;
    private String prefix;
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
