package com.jobportal.controller;

import com.jobportal.dto.request.ApplicationRequest;
import com.jobportal.dto.response.ApplicationResponse;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/{jobId}")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @PathVariable Long jobId,
            @RequestBody(required = false) ApplicationRequest request,
            Authentication authentication) {
        String coverLetter = request != null ? request.getCoverLetter() : null;
        return new ResponseEntity<>(
                applicationService.applyToJob(jobId, coverLetter, authentication.getName()),
                HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getMyApplications(authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicantsForJob(
            @PathVariable Long jobId, Authentication authentication) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId, authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> withdrawApplication(
            @PathVariable Long id, Authentication authentication) {
        applicationService.withdrawApplication(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
