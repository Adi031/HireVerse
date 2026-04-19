package com.jobportal.dto.request;

import lombok.Data;

@Data
public class RecruiterProfileRequest {
    @jakarta.validation.constraints.NotBlank(message="Name is required")
    private String name;

    @jakarta.validation.constraints.NotBlank(message="Company name is required")
    private String companyName;

    @jakarta.validation.constraints.Pattern(regexp="^(https?://.*|)$", message="Website must be a valid URL")
    private String website;

    private String description;
}
