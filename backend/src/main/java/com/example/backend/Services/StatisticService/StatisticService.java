package com.example.backend.Services.StatisticService;

import com.example.backend.DTO.StatisticDTO;

import java.util.List;
import java.util.UUID;

public interface StatisticService {
    List<StatisticDTO> getAll();
    StatisticDTO getById(UUID id);
    StatisticDTO create(StatisticDTO dto);
    StatisticDTO update(UUID id, StatisticDTO dto);
    void delete(UUID id);
}
