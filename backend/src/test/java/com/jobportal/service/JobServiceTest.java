package com.jobportal.service;

import com.jobportal.entity.JobListing;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.JobListingRepository;
import com.jobportal.repository.RecruiterProfileRepository;
import com.jobportal.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobListingRepository jobListingRepository;
    @Mock
    private RecruiterProfileRepository recruiterProfileRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    void getJobById_ThrowsResourceNotFoundException_WhenJobNotFound() {
        when(jobListingRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(1L));
    }

    @Test
    void getJobById_Success() {
        when(jobListingRepository.findById(anyLong())).thenReturn(Optional.of(new JobListing()));

        jobService.getJobById(1L);

        verify(jobListingRepository).findById(1L);
    }

    @Test
    void updateJobStatus_ThrowsResourceNotFoundException_WhenJobNotFound() {
        when(jobListingRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> jobService.updateJobStatus(1L, null, "test@test.com"));
    }
}