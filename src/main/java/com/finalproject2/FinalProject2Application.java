package com.finalproject2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.finalproject2.entity.Account;
import com.finalproject2.entity.Role;
import com.finalproject2.repository.AccountRepository;
import com.finalproject2.repository.RoleRepository;
import java.util.Set;
import java.util.HashSet;

@SpringBootApplication
public class FinalProject2Application {

    public static void main(String[] args) {
        SpringApplication.run(FinalProject2Application.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(AccountRepository accountRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (accountRepo.findByGmail("hhtt3095@gmail.com").isEmpty()) {
                Role adminRole = roleRepo.findByName("ADMIN").orElseGet(() -> {
                    Role r = new Role();
                    r.setName("ADMIN");
                    return roleRepo.save(r);
                });
                
                Account admin = new Account();
                admin.setUsername("Admin");
                admin.setGmail("hhtt3095@gmail.com");
                admin.setPasswordHash(passwordEncoder.encode("123456"));
                admin.setAccountCode("ACC-ADMIN-2");
                admin.setIsActive(true);
                
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                admin.setRoles(roles);
                
                accountRepo.save(admin);
                System.out.println("ADMIN ACCOUNT CREATED!");
            }
        };
    }
}

