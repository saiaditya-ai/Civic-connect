package com.civic.issue.dto;

import com.civic.issue.model.IssueStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IssueResponseDTO {
	private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private IssueStatus status;
}
