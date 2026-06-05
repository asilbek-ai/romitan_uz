package com.example.backend.Controller;

import com.example.backend.DTO.StatisticDTO;
import com.example.backend.Services.StatisticService.StatisticService;
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
@RequestMapping({"/api/v1/statistics", "/api/statistics"})
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping
    public ResponseEntity<List<StatisticDTO>> getAll() {
        return ResponseEntity.ok(statisticService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatisticDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(statisticService.getById(id));
    }

    @PostMapping
    public ResponseEntity<StatisticDTO> create(@RequestBody StatisticDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(statisticService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StatisticDTO> update(@PathVariable UUID id, @RequestBody StatisticDTO dto) {
        return ResponseEntity.ok(statisticService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        statisticService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
