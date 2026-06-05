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
public class StatisticDTO {
    private UUID id;
    private String label;
    private String labelRu;
    private String labelEn;
    private Long value;
    private String icon;
    private String suffix;
    private String prefix;
    @JsonProperty("order")
    private Integer orderNumber;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
