package com.jobportal.dto.response;

import com.jobportal.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private Long jobListingId;
    private String jobTitle;
    private String companyName;
    private ApplicationStatus status;
    private String coverLetter;
    private Integer atsScore;       // 0-100 skill match %
    private String candidateResumeUrl; // Resume link from candidate profile
    private LocalDateTime appliedAt;
}
