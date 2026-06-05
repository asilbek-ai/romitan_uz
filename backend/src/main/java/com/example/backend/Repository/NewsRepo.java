package com.example.backend.Repository;

import com.example.backend.Entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NewsRepo extends JpaRepository<News, UUID> {
    List<News> findAllByOrderByCreatedAtDesc();
    Optional<News> findBySlug(String slug);
}
