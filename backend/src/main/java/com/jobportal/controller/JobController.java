package com.jobportal.controller;

import com.jobportal.entity.Category;
import com.jobportal.entity.JobListing;
import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.enums.ListingStatus;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.jobportal.enums.ListingType;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(jobService.getAllCategories());
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAllActiveJobs(
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postedAt").descending());
        return ResponseEntity.ok(jobService.getAllActiveJobs(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> searchJobs(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) ListingType type) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request, Authentication authentication) {
        String email = authentication.getName();
        return new ResponseEntity<>(jobService.createJob(request, email), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/recruiter/my-listings")
    public ResponseEntity<List<JobResponse>> getMyListings(Authentication authentication) {
        return ResponseEntity.ok(jobService.getMyListings(authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<JobResponse> updateJobStatus(@PathVariable Long id, @RequestParam ListingStatus status, Authentication authentication) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(jobService.updateJob(id, request, authentication.getName()));
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication authentication) {
        jobService.deleteJob(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
