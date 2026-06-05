package com.example.backend.Config;

import com.example.backend.Entity.*;
import com.example.backend.Enums.UserRoles;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.*;

@Configuration
@RequiredArgsConstructor
public class AutoRun implements CommandLineRunner {
    private final RoleRepo roleRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) throws Exception {
        String adminPhone = "admin1234";

            saveRoles();
        Optional<User> userByPhone = userRepo.findByPhone(adminPhone);
        saveUser(adminPhone, userByPhone);



        User aliasqar = User.builder()
                .phone("992724994")
                .password(passwordEncoder.encode("992724994"))
                .roles(List.of(roleRepo.findByName(UserRoles.ROLE_INTERNATIONAL)))
                .build();
        Optional<User> byPhone = userRepo.findByPhone("992724994");
        if (byPhone.isEmpty()){
            userRepo.save(aliasqar);
        }




    }

    private void saveUser(String adminPhone, Optional<User> userByPhone) {
        if (userByPhone.isEmpty()) {
            User user = User.builder()
                    .phone(adminPhone)
                    .password(passwordEncoder.encode("00000000"))
                    .roles(List.of(roleRepo.findByName(UserRoles.ROLE_ADMIN)))
                    .build();
            userRepo.save(user);
            User user1 = User.builder()
                    .phone(adminPhone + "5")
                    .password(passwordEncoder.encode("00000000"))
                    .roles(List.of(roleRepo.findByName(UserRoles.ROLE_ADMIN)))
                    .build();
            userRepo.save(user1);

            User generator = User.builder()
                    .phone("generator")
                    .password(passwordEncoder.encode("00000000"))
                    .roles(List.of(roleRepo.findByName(UserRoles.ROLE_GENERATOR)))
                    .build();
            userRepo.save(generator);
        }
    }

    private void saveRoles() {
        Optional<Role> roleById1 = roleRepo.findById(1);
        if (roleById1.isEmpty()){
            Role role = new Role(1, UserRoles.ROLE_ADMIN);
            roleRepo.save(role);
        }

        Optional<Role> roleById2 = roleRepo.findById(2);
        if (roleById2.isEmpty()){
            Role role = new Role(2, UserRoles.ROLE_STUDENT);
            roleRepo.save(role);
        }


        Optional<Role> roleById4 = roleRepo.findById(3);
        if (roleById4.isEmpty()){
            Role role = new Role(4, UserRoles.ROLE_USER);
            roleRepo.save(role);
        }

        Optional<Role> roleById5 = roleRepo.findById(4);
        if (roleById5.isEmpty()){
            Role role = new Role(5, UserRoles.ROLE_TEACHER);
            roleRepo.save(role);
        }

        Optional<Role> roleById6 = roleRepo.findById(5);
        if (roleById6.isEmpty()){
            Role role = new Role(6, UserRoles.ROLE_ADMINISTRATOR);
            roleRepo.save(role);
        }

        Optional<Role> roleById7 = roleRepo.findById(6);
        if (roleById7.isEmpty()){
            Role role = new Role(7, UserRoles.ROLE_RECTOR);
            roleRepo.save(role);
        }

        Optional<Role> roleById8 = roleRepo.findById(7);
        if (roleById8.isEmpty()){
            Role role = new Role(8, UserRoles.ROLE_GENERATOR);
            roleRepo.save(role);
        }
        Optional<Role> roleById9 = roleRepo.findById(9);
        if (roleById9.isEmpty()){
            Role role = new Role(9, UserRoles.ROLE_INTERNATIONAL);
            roleRepo.save(role);
        }
            }
}


