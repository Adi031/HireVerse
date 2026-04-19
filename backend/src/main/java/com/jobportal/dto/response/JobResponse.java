package com.jobportal.dto.response;

import com.jobportal.enums.ListingStatus;
import com.jobportal.enums.ListingType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private ListingType type;
    private Double salary;
    private LocalDate deadline;
    private ListingStatus status;
    private LocalDateTime postedAt;
    private String categoryName;
    private String companyName;
    private Long recruiterId;
    private Long applicationCount;
    private List<String> requiredSkills;
}
