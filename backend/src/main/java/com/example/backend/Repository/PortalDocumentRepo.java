package com.example.backend.Repository;

import com.example.backend.Entity.PortalDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PortalDocumentRepo extends JpaRepository<PortalDocument, UUID> {
    List<PortalDocument> findAllByIsPublishedTrueOrderByYearDescCreatedAtDesc();
}
