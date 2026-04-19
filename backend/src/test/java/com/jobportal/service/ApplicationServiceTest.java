package com.jobportal.service;

import com.jobportal.dto.request.ApplicationRequest;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.JobListing;
import com.jobportal.entity.User;
import com.jobportal.enums.ListingStatus;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.JobListingRepository;
import com.jobportal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private JobListingRepository jobListingRepository;
    @Mock
    private CandidateProfileRepository candidateProfileRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private User user;
    private CandidateProfile profile;
    private JobListing job;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        profile = new CandidateProfile();
        profile.setId(1L);
        job = new JobListing();
        job.setId(1L);
        job.setStatus(ListingStatus.ACTIVE);
    }

    @Test
    void applyToJob_ThrowsIllegalArgumentException_WhenJobClosed() {
        job.setStatus(ListingStatus.CLOSED);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(candidateProfileRepository.findByUserId(anyLong())).thenReturn(Optional.of(profile));
        when(jobListingRepository.findById(anyLong())).thenReturn(Optional.of(job));

        assertThrows(IllegalArgumentException.class, () -> applicationService.applyToJob(1L, new ApplicationRequest(), "test@test.com"));
    }

    @Test
    void applyToJob_ThrowsIllegalArgumentException_WhenAlreadyApplied() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(candidateProfileRepository.findByUserId(anyLong())).thenReturn(Optional.of(profile));
        when(jobListingRepository.findById(anyLong())).thenReturn(Optional.of(job));
        when(applicationRepository.existsByCandidateIdAndJobListingId(anyLong(), anyLong())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> applicationService.applyToJob(1L, new ApplicationRequest(), "test@test.com"));
    }
}
