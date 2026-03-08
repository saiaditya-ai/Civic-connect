package com.civic.issue.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.civic.common.exception.ResourceNotFoundException;
import com.civic.issue.dto.CreateIssueRequestDTO;
import com.civic.issue.dto.IssueResponseDTO;
import com.civic.issue.model.Issue;
import com.civic.issue.model.IssueStatus;
import com.civic.issue.repo.IssueRepository;
import com.civic.user.model.User;
import com.civic.user.repo.UserRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService{
	private final IssueRepository issueRepository;
	private final UserRepository userRepository;

    @Override
    public IssueResponseDTO createIssue(CreateIssueRequestDTO requestDTO) {
    	
    	String email = SecurityContextHolder.getContext().getAuthentication().getName();
    	User user = userRepository.findByEmail(email)
    			.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

    	Issue issue = Issue.builder()
    	        .title(requestDTO.getTitle())
    	        .description(requestDTO.getDescription())
    	        .latitude(requestDTO.getLatitude())
    	        .longitude(requestDTO.getLongitude())
    	        .reportedBy(user)
    	        .status(IssueStatus.OPEN)
    	        .build();

        Issue savedIssue = issueRepository.save(issue);

        return mapToResponse(savedIssue);
    }

    @Override
    public IssueResponseDTO getIssueById(Long id) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        return mapToResponse(issue);
    }

    @Override
    public List<IssueResponseDTO> getAllIssues() {

        return issueRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public IssueResponseDTO updateIssueStatus(Long id, CreateIssueRequestDTO requestDTO) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        issue.setTitle(requestDTO.getTitle());
        issue.setDescription(requestDTO.getDescription());
        issue.setLatitude(requestDTO.getLatitude());
        issue.setLongitude(requestDTO.getLongitude());

        issue = issueRepository.save(issue);

        return mapToResponse(issue);
    }

    @Override
    public void deleteIssue(Long id) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        issueRepository.delete(issue);
    }
    @Override
    public List<IssueResponseDTO> findNearbyIssues(double lat, double lon, double radius) {

        return issueRepository.findNearbyIssues(lat, lon, radius)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private IssueResponseDTO mapToResponse(Issue issue) {
    	return IssueResponseDTO.builder()
    	        .id(issue.getId())
    	        .title(issue.getTitle())
    	        .description(issue.getDescription())
    	        .latitude(issue.getLatitude())
    	        .longitude(issue.getLongitude())
    	        .status(issue.getStatus())
    	        .build();
    }
}
