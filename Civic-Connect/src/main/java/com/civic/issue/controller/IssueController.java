package com.civic.issue.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.civic.issue.dto.CreateIssueRequestDTO;
import com.civic.issue.dto.IssueResponseDTO;
import com.civic.issue.service.IssueService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
	private final IssueService issueService;
	@PostMapping
    public ResponseEntity<IssueResponseDTO> createIssue(
            @RequestBody CreateIssueRequestDTO requestDTO) {

        IssueResponseDTO response = issueService.createIssue(requestDTO);
        return ResponseEntity.ok(response);
    }
	@GetMapping("/{id}")
    public ResponseEntity<IssueResponseDTO> getIssueById(@PathVariable Long id) {

        IssueResponseDTO response = issueService.getIssueById(id);
        return ResponseEntity.ok(response);
    }
	@GetMapping
    public ResponseEntity<List<IssueResponseDTO>> getAllIssues() {

        List<IssueResponseDTO> response = issueService.getAllIssues();
        return ResponseEntity.ok(response);
    }
	@PutMapping("/{id}/status")
    public ResponseEntity<IssueResponseDTO> updateIssueStatus(
            @PathVariable Long id,
            @RequestBody CreateIssueRequestDTO requestDTO) {

        IssueResponseDTO response = issueService.updateIssueStatus(id, requestDTO);
        return ResponseEntity.ok(response);
    }
	@GetMapping("/nearby")
	public ResponseEntity<List<IssueResponseDTO>> getNearbyIssues(
	        @RequestParam double lat,
	        @RequestParam double lon,
	        @RequestParam double radius) {

	    return ResponseEntity.ok(issueService.findNearbyIssues(lat, lon, radius));
	}
	@DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIssue(@PathVariable Long id) {

        issueService.deleteIssue(id);
        return ResponseEntity.ok("Issue deleted successfully");
    }
}
