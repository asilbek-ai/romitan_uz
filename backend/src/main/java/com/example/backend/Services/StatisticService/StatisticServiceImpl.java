package com.example.backend.Services.StatisticService;

import com.example.backend.DTO.StatisticDTO;
import com.example.backend.Entity.Statistic;
import com.example.backend.Repository.StatisticRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final StatisticRepo statisticRepo;

    @Override
    public List<StatisticDTO> getAll() {
        return statisticRepo.findAllByIsActiveTrueOrderByOrderNumberAsc().stream().map(this::toDto).toList();
    }

    @Override
    public StatisticDTO getById(UUID id) {
        return toDto(findById(id));
    }

    @Override
    public StatisticDTO create(StatisticDTO dto) {
        Statistic statistic = new Statistic();
        copyToEntity(dto, statistic);
        return toDto(statisticRepo.save(statistic));
    }

    @Override
    public StatisticDTO update(UUID id, StatisticDTO dto) {
        Statistic statistic = findById(id);
        copyToEntity(dto, statistic);
        return toDto(statisticRepo.save(statistic));
    }

    @Override
    public void delete(UUID id) {
        if (!statisticRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Statistic not found");
        }
        statisticRepo.deleteById(id);
    }

    private Statistic findById(UUID id) {
        return statisticRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Statistic not found"));
    }

    private void copyToEntity(StatisticDTO dto, Statistic statistic) {
        statistic.setLabel(dto.getLabel());
        statistic.setLabelRu(dto.getLabelRu());
        statistic.setLabelEn(dto.getLabelEn());
        statistic.setValue(dto.getValue());
        statistic.setIcon(dto.getIcon());
        statistic.setSuffix(dto.getSuffix());
        statistic.setPrefix(dto.getPrefix());
        statistic.setOrderNumber(dto.getOrderNumber());
        statistic.setIsActive(dto.getIsActive());
    }

    private StatisticDTO toDto(Statistic statistic) {
        return new StatisticDTO(
                statistic.getId(),
                statistic.getLabel(),
                statistic.getLabelRu(),
                statistic.getLabelEn(),
                statistic.getValue(),
                statistic.getIcon(),
                statistic.getSuffix(),
                statistic.getPrefix(),
                statistic.getOrderNumber(),
                statistic.getIsActive(),
                statistic.getCreatedAt(),
                statistic.getUpdatedAt()
        );
    }
}
