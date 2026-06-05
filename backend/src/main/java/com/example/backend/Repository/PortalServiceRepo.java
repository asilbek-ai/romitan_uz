package com.example.backend.Repository;

import com.example.backend.Entity.PortalService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PortalServiceRepo extends JpaRepository<PortalService, UUID> {
    List<PortalService> findAllByIsActiveTrueOrderByOrderNumberAsc();
}
