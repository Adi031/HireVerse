package com.jobportal.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CandidateProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String education;
    private String experience;
    private List<String> skills;
    private String resumeUrl;
}
