package com.jobportal.service;

import com.jobportal.dto.request.CandidateProfileRequest;
import com.jobportal.dto.response.CandidateProfileResponse;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Skill;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.SkillRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public CandidateProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId()).orElseThrow();
        return mapToResponse(profile);
    }

    public CandidateProfileResponse updateMyProfile(CandidateProfileRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId()).orElseThrow();

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
            userRepository.save(user);
        }

        profile.setBio(request.getBio());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setResumeUrl(request.getResumeUrl());

        if (request.getSkills() != null) {
            Set<Skill> skills = request.getSkills().stream().map(skillName -> {
                return skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
            }).collect(Collectors.toSet());
            profile.setSkills(skills);
        }

        return mapToResponse(candidateProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public CandidateProfileResponse getCandidateProfileById(Long id) {
        CandidateProfile profile = candidateProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        return mapToResponse(profile);
    }

    private CandidateProfileResponse mapToResponse(CandidateProfile profile) {
        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .bio(profile.getBio())
                .education(profile.getEducation())
                .experience(profile.getExperience())
                .skills(profile.getSkills().stream().map(Skill::getName).collect(Collectors.toList()))
                .resumeUrl(profile.getResumeUrl())
                .build();
    }
}
