package com.civic.issue.dto;

import lombok.Data;

@Data
public class CreateIssueRequestDTO {
	 private String title;
	 private String description;
	 private String imageUrl;
	 private Double latitude;
	 private Double longitude;
}

