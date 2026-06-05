package com.example.backend.Services.PortalServiceService;

import com.example.backend.DTO.PortalServiceDTO;
import com.example.backend.Entity.PortalService;
import com.example.backend.Repository.PortalServiceRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortalServiceServiceImpl implements PortalServiceService {

    private final PortalServiceRepo portalServiceRepo;

    @Override
    public List<PortalServiceDTO> getAll() {
        return portalServiceRepo.findAllByIsActiveTrueOrderByOrderNumberAsc().stream().map(this::toDto).toList();
    }

    @Override
    public PortalServiceDTO getById(UUID id) {
        return toDto(findById(id));
    }

    @Override
    public PortalServiceDTO create(PortalServiceDTO dto) {
        PortalService portalService = new PortalService();
        copyToEntity(dto, portalService);
        return toDto(portalServiceRepo.save(portalService));
    }

    @Override
    public PortalServiceDTO update(UUID id, PortalServiceDTO dto) {
        PortalService portalService = findById(id);
        copyToEntity(dto, portalService);
        return toDto(portalServiceRepo.save(portalService));
    }

    @Override
    public void delete(UUID id) {
        if (!portalServiceRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }
        portalServiceRepo.deleteById(id);
    }

    private PortalService findById(UUID id) {
        return portalServiceRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    private void copyToEntity(PortalServiceDTO dto, PortalService portalService) {
        portalService.setName(dto.getName());
        portalService.setNameRu(dto.getNameRu());
        portalService.setNameEn(dto.getNameEn());
        portalService.setCategory(dto.getCategory());
        portalService.setDescription(dto.getDescription());
        portalService.setDescriptionRu(dto.getDescriptionRu());
        portalService.setDescriptionEn(dto.getDescriptionEn());
        portalService.setDepartment(dto.getDepartment());
        portalService.setLink(dto.getLink());
        portalService.setPhone(dto.getPhone());
        portalService.setEmail(dto.getEmail());
        portalService.setIcon(dto.getIcon());
        portalService.setOrderNumber(dto.getOrderNumber());
        portalService.setIsActive(dto.getIsActive());
    }

    private PortalServiceDTO toDto(PortalService portalService) {
        return new PortalServiceDTO(
                portalService.getId(),
                portalService.getName(),
                portalService.getNameRu(),
                portalService.getNameEn(),
                portalService.getCategory(),
                portalService.getDescription(),
                portalService.getDescriptionRu(),
                portalService.getDescriptionEn(),
                portalService.getDepartment(),
                portalService.getLink(),
                portalService.getPhone(),
                portalService.getEmail(),
                portalService.getIcon(),
                portalService.getOrderNumber(),
                portalService.getIsActive(),
                portalService.getCreatedAt(),
                portalService.getUpdatedAt()
        );
    }
}
