package com.jobportal.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CandidateProfileRequest {
    @jakarta.validation.constraints.NotBlank(message="Name is required")
    private String name;
    
    @jakarta.validation.constraints.Size(max=500, message="Bio must be under 500 characters")
    private String bio;
    
    @jakarta.validation.constraints.Size(max=300, message="Education must be under 300 characters")
    private String education;
    
    private String experience;
    private List<String> skills;

    @jakarta.validation.constraints.Size(max=500, message="Resume URL must be under 500 characters")
    private String resumeUrl;
}
