package com.example.backend.Services.MediaService;

import com.example.backend.DTO.MediaDTO;
import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.Media;
import com.example.backend.Repository.AttachmentRepo;
import com.example.backend.Repository.MediaRepo;
import com.example.backend.Services.AttachmentService.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepo mediaRepo;
    private final AttachmentRepo attachmentRepo;
    private final AttachmentService attachmentService;

    @Override
    public List<MediaDTO> getAll() {
        return mediaRepo.findAllByIsPublishedTrueOrderByOrderNumberAsc().stream().map(this::toDto).toList();
    }

    @Override
    public MediaDTO getById(UUID id) {
        return toDto(findById(id));
    }

    @Override
    public MediaDTO create(MediaDTO dto) {
        Media media = new Media();
        copyToEntity(dto, media);
        return toDto(mediaRepo.save(media));
    }

    @Override
    public MediaDTO update(UUID id, MediaDTO dto) {
        Media media = findById(id);
        copyToEntity(dto, media);
        return toDto(mediaRepo.save(media));
    }

    @Override
    public void delete(UUID id) {
        if (!mediaRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media not found");
        }
        mediaRepo.deleteById(id);
    }

    private Media findById(UUID id) {
        return mediaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Media not found"));
    }

    private void copyToEntity(MediaDTO dto, Media media) {
        media.setTitle(dto.getTitle());
        media.setTitleRu(dto.getTitleRu());
        media.setTitleEn(dto.getTitleEn());
        media.setImageUrl(dto.getImageUrl());
        if (dto.getImageId() != null) {
            Attachment image = attachmentRepo.findById(dto.getImageId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));
            media.setImage(image);
        }
        media.setThumbnailUrl(dto.getThumbnailUrl());
        media.setCategory(dto.getCategory());
        media.setIs360(dto.getIs360());
        media.setOrderNumber(dto.getOrderNumber());
        media.setIsPublished(dto.getIsPublished());
    }

    private MediaDTO toDto(Media media) {
        String imageUrl = media.getImage() != null
                ? attachmentService.getFileUrl(media.getImage().getId())
                : media.getImageUrl();
        return new MediaDTO(
                media.getId(),
                media.getTitle(),
                media.getTitleRu(),
                media.getTitleEn(),
                imageUrl,
                media.getImage() != null ? media.getImage().getId() : null,
                media.getThumbnailUrl(),
                media.getCategory(),
                media.getIs360(),
                media.getOrderNumber(),
                media.getIsPublished(),
                media.getCreatedAt(),
                media.getUpdatedAt()
        );
    }
}
