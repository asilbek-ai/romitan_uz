package com.example.backend.Services.NewsService;

import com.example.backend.DTO.NewsDTO;

import java.util.List;
import java.util.UUID;

public interface NewsService {
    List<NewsDTO> getAll();
    NewsDTO getById(UUID id);
    NewsDTO create(NewsDTO dto);
    NewsDTO update(UUID id, NewsDTO dto);
    void delete(UUID id);
}
