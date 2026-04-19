package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecruiterProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String companyName;
    private String website;
    private String description;
}
