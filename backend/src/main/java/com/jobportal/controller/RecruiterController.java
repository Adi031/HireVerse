package com.jobportal.controller;

import com.jobportal.dto.request.RecruiterProfileRequest;
import com.jobportal.dto.response.RecruiterProfileResponse;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.jobportal.service.RecruiterService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(recruiterService.getMyProfile(authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileResponse> updateMyProfile(@Valid @RequestBody RecruiterProfileRequest request, Authentication authentication) {
        return ResponseEntity.ok(recruiterService.updateMyProfile(request, authentication.getName()));
    }
}
