package com.civic.issue.service;

import java.util.List;

import com.civic.issue.dto.CreateIssueRequestDTO;
import com.civic.issue.dto.IssueResponseDTO;

public interface IssueService {
	IssueResponseDTO createIssue(CreateIssueRequestDTO request);

    IssueResponseDTO getIssueById(Long id);

    List<IssueResponseDTO> getAllIssues();
    
    void deleteIssue(Long id);

	IssueResponseDTO updateIssueStatus(Long id, CreateIssueRequestDTO requestDTO);
	
	List<IssueResponseDTO> findNearbyIssues(double lat, double lon, double radius);
}
