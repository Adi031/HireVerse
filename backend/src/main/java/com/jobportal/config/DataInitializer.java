package com.jobportal.config;

import com.jobportal.entity.Category;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        // Seed categories
        List<String> cats = List.of("Information Technology", "Finance",
                "Marketing", "Design", "Data Science", "Management",
                "Sales", "Engineering", "Healthcare", "Education");

        cats.forEach(name -> {
            if (categoryRepository.findByName(name).isEmpty()) {
                categoryRepository.save(Category.builder().name(name).build());
            }
        });

        // Seed Admin user
        if (!userRepository.existsByEmail("admin@hireverseapp.com")) {
            userRepository.save(User.builder()
                    .name("Admin")
                    .email("admin@hireverseapp.com")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build());
        }
    }
}
