package com.jobportal.service;

import com.jobportal.dto.request.RecruiterProfileRequest;
import com.jobportal.dto.response.RecruiterProfileResponse;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruiterService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public RecruiterProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();
        return mapToResponse(profile);
    }

    public RecruiterProfileResponse updateMyProfile(RecruiterProfileRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId()).orElseThrow();

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
            userRepository.save(user);
        }

        profile.setCompanyName(request.getCompanyName());
        profile.setWebsite(request.getWebsite());
        profile.setDescription(request.getDescription());

        return mapToResponse(recruiterProfileRepository.save(profile));
    }

    private RecruiterProfileResponse mapToResponse(RecruiterProfile profile) {
        return RecruiterProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .companyName(profile.getCompanyName())
                .website(profile.getWebsite())
                .description(profile.getDescription())
                .build();
    }
}
