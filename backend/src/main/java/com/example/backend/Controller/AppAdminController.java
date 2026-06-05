package com.example.backend.Controller;

import com.example.backend.DTO.AddUserDto;
import com.example.backend.Entity.Administrator;
import com.example.backend.Repository.AdministratorRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/app/admin")
public class AppAdminController {

    private final AdministratorRepo administratorRepo;
    private final PasswordEncoder passwordEncoder;

    // Add a new administrator
    @PostMapping("/add")
    public HttpEntity<?> addUserForNominklatura(@RequestBody AddUserDto userDTO) {
        Administrator admin = new Administrator(
                userDTO.getName(),
                userDTO.getLogin(),
                passwordEncoder.encode(userDTO.getPassword()),
                LocalDateTime.now()
        );
        administratorRepo.save(admin);
        return ResponseEntity.ok("New user created");
    }

    // Get all administrators
    @GetMapping("/getadministrator")
    public HttpEntity<?> getAdministrator() {
        return ResponseEntity.ok(administratorRepo.findAll());
    }

    // Delete an administrator by ID
    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteAdministrator(@PathVariable Integer id) {
        administratorRepo.deleteById(id);
        return ResponseEntity.ok("Administrator deleted successfully");
    }

    // Update an administrator by ID
    @PutMapping("/{id}")
    public HttpEntity<?> updateAdministrator(@PathVariable Integer id, @RequestBody AddUserDto userDTO) {
        return administratorRepo.findById(id).map(admin -> {
            admin.setName(userDTO.getName());
            admin.setLogin(userDTO.getLogin());
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                admin.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }
            administratorRepo.save(admin);
            return ResponseEntity.ok("Administrator updated successfully");
        }).orElse(ResponseEntity.badRequest().body("Administrator not found"));
    }


}
