package com.jobportal.repository;

import com.jobportal.entity.JobListing;
import com.jobportal.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.jobportal.enums.ListingType;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Long> {
    Page<JobListing> findByStatus(ListingStatus status, Pageable pageable);
    List<JobListing> findByStatus(ListingStatus status);
    List<JobListing> findByRecruiterId(Long recruiterId);
    Long countByStatus(ListingStatus status);

    @Query("SELECT j FROM JobListing j WHERE j.status = 'ACTIVE' AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<JobListing> searchJobs(@Param("keyword") String keyword);

    List<JobListing> findByStatusAndType(ListingStatus status, ListingType type);
    List<JobListing> findByStatusAndDeadlineBefore(ListingStatus status, java.time.LocalDate date);
}
