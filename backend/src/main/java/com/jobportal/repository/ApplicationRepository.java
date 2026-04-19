package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByJobListingId(Long jobListingId);
    boolean existsByCandidateIdAndJobListingId(Long candidateId, Long jobListingId);
    Long countByJobListingId(Long jobListingId);
}
