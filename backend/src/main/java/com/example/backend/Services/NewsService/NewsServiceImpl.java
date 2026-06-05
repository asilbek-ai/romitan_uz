package com.example.backend.Services.NewsService;

import com.example.backend.DTO.NewsDTO;
import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.News;
import com.example.backend.Repository.AttachmentRepo;
import com.example.backend.Repository.NewsRepo;
import com.example.backend.Services.AttachmentService.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepo newsRepo;
    private final AttachmentRepo attachmentRepo;
    private final AttachmentService attachmentService;

    @Override
    public List<NewsDTO> getAll() {
        return newsRepo.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList();
    }

    @Override
    public NewsDTO getById(UUID id) {
        return toDto(findById(id));
    }

    @Override
    public NewsDTO create(NewsDTO dto) {
        News news = new News();
        copyToEntity(dto, news);
        return toDto(newsRepo.save(news));
    }

    @Override
    public NewsDTO update(UUID id, NewsDTO dto) {
        News news = findById(id);
        copyToEntity(dto, news);
        return toDto(newsRepo.save(news));
    }

    @Override
    public void delete(UUID id) {
        if (!newsRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found");
        }
        newsRepo.deleteById(id);
    }

    private News findById(UUID id) {
        return newsRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "News not found"));
    }

    private void copyToEntity(NewsDTO dto, News news) {
        news.setTitle(dto.getTitle());
        news.setTitleRu(dto.getTitleRu());
        news.setTitleEn(dto.getTitleEn());
        news.setSlug(dto.getSlug());
        news.setImageUrl(dto.getImageUrl());
        if (dto.getImageId() != null) {
            Attachment image = attachmentRepo.findById(dto.getImageId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));
            news.setImage(image);
        }
        news.setSummary(dto.getSummary());
        news.setSummaryRu(dto.getSummaryRu());
        news.setSummaryEn(dto.getSummaryEn());
        news.setContent(dto.getContent());
        news.setContentRu(dto.getContentRu());
        news.setContentEn(dto.getContentEn());
        news.setAuthor(dto.getAuthor());
        news.setViews(dto.getViews());
        news.setIsPublished(dto.getIsPublished());
        news.setPublishedDate(dto.getPublishedDate());
        news.setTags(dto.getTags());
    }

    private NewsDTO toDto(News news) {
        String imageUrl = news.getImage() != null
                ? attachmentService.getFileUrl(news.getImage().getId())
                : news.getImageUrl();
        return new NewsDTO(
                news.getId(),
                news.getTitle(),
                news.getTitleRu(),
                news.getTitleEn(),
                news.getSlug(),
                imageUrl,
                news.getImage() != null ? news.getImage().getId() : null,
                news.getSummary(),
                news.getSummaryRu(),
                news.getSummaryEn(),
                news.getContent(),
                news.getContentRu(),
                news.getContentEn(),
                news.getAuthor(),
                news.getViews(),
                news.getIsPublished(),
                news.getPublishedDate(),
                news.getTags(),
                news.getCreatedAt(),
                news.getUpdatedAt()
        );
    }
}
