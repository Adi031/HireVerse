package com.jobportal.service;

import com.jobportal.dto.response.ApplicationResponse;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.JobListing;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.ListingStatus;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.JobListingRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobListingRepository jobListingRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    public ApplicationResponse applyToJob(Long jobId, String coverLetter, String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail).orElseThrow();
        CandidateProfile candidate = candidateProfileRepository.findByUserId(user.getId()).orElseThrow();

        JobListing job = jobListingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() != ListingStatus.ACTIVE) {
            throw new IllegalArgumentException("Cannot apply to a closed or pending job");
        }

        if (applicationRepository.existsByCandidateIdAndJobListingId(candidate.getId(), job.getId())) {
            throw new IllegalArgumentException("You have already applied to this job");
        }

        // Calculate ATS Score — null means no required skills were set
        Integer atsScore = null;
        List<String> requiredSkills = job.getRequiredSkills();
        if (requiredSkills != null && !requiredSkills.isEmpty()) {
            Set<String> candidateSkills = candidate.getSkills().stream()
                    .map(s -> s.getName().toLowerCase())
                    .collect(Collectors.toSet());
            long matches = requiredSkills.stream()
                    .filter(s -> candidateSkills.contains(s.toLowerCase()))
                    .count();
            atsScore = (int) ((matches * 100) / requiredSkills.size());
        }

        Application application = Application.builder()
                .candidate(candidate)
                .jobListing(job)
                .coverLetter(coverLetter)
                .atsScore(atsScore)
                .build();

        return mapToResponse(applicationRepository.save(application));
    }

    public List<ApplicationResponse> getMyApplications(String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail).orElseThrow();
        CandidateProfile candidate = candidateProfileRepository.findByUserId(user.getId()).orElseThrow();
        return applicationRepository.findByCandidateId(candidate.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicantsForJob(Long jobId, String recruiterEmail) {
        User user = userRepository.findByEmail(recruiterEmail).orElseThrow();
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();
        JobListing job = jobListingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You can only view applicants for your own listings");
        }
        return applicationRepository.findByJobListingId(jobId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ApplicationResponse updateApplicationStatus(Long id, ApplicationStatus status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        application.setStatus(status);
        return mapToResponse(applicationRepository.save(application));
    }

    public void withdrawApplication(Long id, String candidateEmail) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        User user = userRepository.findByEmail(candidateEmail).orElseThrow();
        CandidateProfile candidate = candidateProfileRepository.findByUserId(user.getId()).orElseThrow();
        if (!app.getCandidate().getId().equals(candidate.getId())) {
            throw new UnauthorizedException("Not your application");
        }
        if (app.getStatus() != ApplicationStatus.APPLIED) {
            throw new IllegalArgumentException("Cannot withdraw a processed application");
        }
        applicationRepository.delete(app);
    }

    private ApplicationResponse mapToResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .candidateId(application.getCandidate().getId())
                .candidateName(application.getCandidate().getUser().getName())
                .jobListingId(application.getJobListing().getId())
                .jobTitle(application.getJobListing().getTitle())
                .companyName(application.getJobListing().getRecruiter().getCompanyName())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .atsScore(application.getAtsScore())
                .candidateResumeUrl(application.getCandidate().getResumeUrl())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
