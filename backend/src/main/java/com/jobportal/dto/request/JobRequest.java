package com.jobportal.dto.request;

import com.jobportal.enums.ListingType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Type is required (JOB or INTERNSHIP)")
    private ListingType type;

    private Double salary;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;

    @NotBlank(message = "Category name is required")
    private String categoryName;

    private java.util.List<String> requiredSkills;
}
