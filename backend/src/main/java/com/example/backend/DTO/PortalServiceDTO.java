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
public class PortalServiceDTO {
    private UUID id;
    private String name;
    private String nameRu;
    private String nameEn;
    private String category;
    private String description;
    private String descriptionRu;
    private String descriptionEn;
    private String department;
    private String link;
    private String phone;
    private String email;
    private String icon;
    @JsonProperty("order")
    private Integer orderNumber;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
