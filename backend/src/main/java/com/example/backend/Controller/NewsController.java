package com.example.backend.Controller;

import com.example.backend.DTO.NewsDTO;
import com.example.backend.Services.NewsService.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping({"/api/v1/news", "/api/news"})
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAll() {
        return ResponseEntity.ok(newsService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(newsService.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsDTO> create(@RequestBody NewsDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsDTO> update(@PathVariable UUID id, @RequestBody NewsDTO dto) {
        return ResponseEntity.ok(newsService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        newsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
