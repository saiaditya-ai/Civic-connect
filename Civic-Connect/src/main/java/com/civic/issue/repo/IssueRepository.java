package com.civic.issue.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.civic.issue.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long>{
	@Query("""
			SELECT i FROM Issue i
			WHERE 
			(6371 * acos(
			cos(radians(:lat)) * cos(radians(i.latitude)) *
			cos(radians(i.longitude) - radians(:lon)) +
			sin(radians(:lat)) * sin(radians(i.latitude))
			)) <= :radius
			""")
			List<Issue> findNearbyIssues(
			        @Param("lat") double latitude,
			        @Param("lon") double longitude,
			        @Param("radius") double radius
			);
}
