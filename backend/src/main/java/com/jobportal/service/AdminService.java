package com.jobportal.service;

import com.jobportal.dto.response.JobResponse;
import com.jobportal.dto.response.UserResponse;
import com.jobportal.entity.Category;
import com.jobportal.entity.User;
import com.jobportal.enums.ListingStatus;
import com.jobportal.enums.Role;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.JobListingRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final JobListingRepository jobListingRepository;
    private final ApplicationRepository applicationRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId()).name(u.getName()).email(u.getEmail())
                        .role(u.getRole()).isActive(u.getIsActive()).createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(!user.getIsActive());
        user = userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId()).name(user.getName()).email(user.getEmail())
                .role(user.getRole()).isActive(user.getIsActive()).createdAt(user.getCreatedAt())
                .build();
    }

    public String updateJobStatus(Long id, ListingStatus status) {
        var job = jobListingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        job.setStatus(status);
        jobListingRepository.save(job);
        return "Job status updated to " + status;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getPlatformStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCandidates", userRepository.countByRole(Role.CANDIDATE));
        stats.put("totalRecruiters", userRepository.countByRole(Role.RECRUITER));
        stats.put("totalJobs", jobListingRepository.count());
        stats.put("activeJobs", jobListingRepository.countByStatus(ListingStatus.ACTIVE));
        stats.put("totalApplications", applicationRepository.count());
        return stats;
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(String name) {
        if (categoryRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("Category already exists");
        }
        return categoryRepository.save(Category.builder().name(name).build());
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs() {
        return jobListingRepository.findAll().stream()
                .map(job -> JobResponse.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .description(job.getDescription())
                        .location(job.getLocation())
                        .type(job.getType())
                        .salary(job.getSalary())
                        .deadline(job.getDeadline())
                        .status(job.getStatus())
                        .postedAt(job.getPostedAt())
                        .categoryName(job.getCategory() != null ? job.getCategory().getName() : "Uncategorized")
                        .companyName(job.getRecruiter().getCompanyName())
                        .recruiterId(job.getRecruiter().getId())
                        .applicationCount(applicationRepository.countByJobListingId(job.getId())) // FIX: was missing
                        .build())
                .collect(Collectors.toList());
    }

}
