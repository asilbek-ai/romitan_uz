package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AttachmentDTO {
    private UUID id;
    private String url;
    private String originalName;
    private String contentType;
    private Long size;
}
