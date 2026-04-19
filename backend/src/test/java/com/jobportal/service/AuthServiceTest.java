package com.jobportal.service;

import com.jobportal.dto.request.RegisterRequest;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.exception.DuplicateEmailException;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private CandidateProfileRepository candidateProfileRepository;
    @Mock
    private RecruiterProfileRepository recruiterProfileRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole(Role.CANDIDATE);
    }

    @Test
    void register_ThrowsDuplicateEmailException_WhenEmailExists() {
        when(userRepository.existsByEmail(any(String.class))).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(registerRequest));
    }

    @Test
    void register_ThrowsIllegalArgumentException_WhenRecruiterHasNoCompany() {
        registerRequest.setRole(Role.RECRUITER);
        registerRequest.setCompanyName("");

        when(userRepository.existsByEmail(any(String.class))).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(new User());

        assertThrows(IllegalArgumentException.class, () -> authService.register(registerRequest));
    }
}
