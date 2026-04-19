package com.jobportal.controller;

import com.jobportal.dto.request.CandidateProfileRequest;
import com.jobportal.dto.response.CandidateProfileResponse;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Skill;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.SkillRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

import com.jobportal.service.CandidateService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(candidateService.getMyProfile(authentication.getName()));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PutMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> updateMyProfile(@Valid @RequestBody CandidateProfileRequest request, Authentication authentication) {
        return ResponseEntity.ok(candidateService.updateMyProfile(request, authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    @GetMapping("/profile/{id}")
    public ResponseEntity<CandidateProfileResponse> getCandidateProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateProfileById(id));
    }
}
