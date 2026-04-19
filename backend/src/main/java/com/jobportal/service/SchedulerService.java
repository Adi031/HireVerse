package com.jobportal.service;

import com.jobportal.entity.JobListing;
import com.jobportal.enums.ListingStatus;
import com.jobportal.repository.JobListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final JobListingRepository jobListingRepository;

    @Scheduled(cron = "0 0 0 * * *") // Runs at midnight every day
    @Transactional
    public void closeExpiredListings() {
        List<JobListing> expired = jobListingRepository.findByStatusAndDeadlineBefore(ListingStatus.ACTIVE, LocalDate.now());
        expired.forEach(j -> j.setStatus(ListingStatus.CLOSED));
        jobListingRepository.saveAll(expired);
    }
}
