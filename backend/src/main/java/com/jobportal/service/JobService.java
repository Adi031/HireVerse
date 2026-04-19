package com.jobportal.service;

import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.entity.Category;
import com.jobportal.entity.JobListing;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.User;
import com.jobportal.enums.ListingStatus;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.JobListingRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import com.jobportal.enums.ListingType;
import com.jobportal.repository.ApplicationRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobListingRepository jobListingRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public JobResponse createJob(JobRequest request, String recruiterEmail) {
        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseGet(() -> categoryRepository.save(Category.builder().name(request.getCategoryName()).build()));

        JobListing job = JobListing.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .type(request.getType())
                .salary(request.getSalary())
                .recruiter(recruiter)
                .category(category)
                .deadline(request.getDeadline())
                .requiredSkills(request.getRequiredSkills())
                .build();

        job = jobListingRepository.save(job);
        return mapToResponse(job);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> getAllActiveJobs(Pageable pageable) {
        return jobListingRepository.findByStatus(ListingStatus.ACTIVE, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAllActiveJobs() {
        return jobListingRepository.findByStatus(ListingStatus.ACTIVE)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> searchJobs(String keyword, ListingType type) {
        List<com.jobportal.entity.JobListing> results;

        // Step 1 — keyword search OR full active list
        if (keyword != null && !keyword.isBlank()) {
            results = jobListingRepository.searchJobs(keyword.trim());
        } else {
            results = jobListingRepository.findByStatus(ListingStatus.ACTIVE);
        }

        // Step 2 — apply type filter ON TOP of keyword results (was missing before)
        if (type != null) {
            results = results.stream()
                    .filter(j -> j.getType() == type)
                    .collect(Collectors.toList());
        }

        return results.stream().map(this::mapToResponse).collect(Collectors.toList());
    }


    public JobResponse getJobById(Long id) {
        JobListing job = jobListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return mapToResponse(job);
    }

    public List<JobResponse> getMyListings(String recruiterEmail) {
        User user = userRepository.findByEmail(recruiterEmail).orElseThrow();
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();
        return jobListingRepository.findByRecruiterId(recruiter.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JobResponse updateJobStatus(Long id, ListingStatus newStatus, String recruiterEmail) {
        JobListing job = jobListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User user = userRepository.findByEmail(recruiterEmail).orElseThrow();
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You do not have permission to update this job");
        }

        job.setStatus(newStatus);
        return mapToResponse(jobListingRepository.save(job));
    }

    public JobResponse updateJob(Long id, JobRequest request, String recruiterEmail) {
        JobListing job = jobListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        User user = userRepository.findByEmail(recruiterEmail).orElseThrow();
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("Not your listing");
        }

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseGet(() -> categoryRepository.save(Category.builder().name(request.getCategoryName()).build()));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setType(request.getType());
        job.setSalary(request.getSalary());
        job.setDeadline(request.getDeadline());
        job.setCategory(category);
        job.setRequiredSkills(request.getRequiredSkills());

        return mapToResponse(jobListingRepository.save(job));
    }

    public void deleteJob(Long id, String recruiterEmail) {
        JobListing job = jobListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        User user = userRepository.findByEmail(recruiterEmail).orElseThrow();
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("Not your listing");
        }

        jobListingRepository.delete(job);
    }

    private JobResponse mapToResponse(JobListing job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .type(job.getType())
                .salary(job.getSalary())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .postedAt(job.getPostedAt())
                .categoryName(job.getCategory().getName())
                .companyName(job.getRecruiter().getCompanyName())
                .recruiterId(job.getRecruiter().getId())
                .applicationCount(applicationRepository.countByJobListingId(job.getId()))
                .requiredSkills(job.getRequiredSkills())
                .build();
    }
}
