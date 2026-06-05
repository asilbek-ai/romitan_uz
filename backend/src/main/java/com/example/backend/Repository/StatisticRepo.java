package com.example.backend.Repository;

import com.example.backend.Entity.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StatisticRepo extends JpaRepository<Statistic, UUID> {
    List<Statistic> findAllByIsActiveTrueOrderByOrderNumberAsc();
}
