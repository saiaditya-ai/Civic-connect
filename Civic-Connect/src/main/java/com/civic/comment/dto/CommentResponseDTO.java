package com.civic.comment.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentResponseDTO {

    private Long id;
    private String message;
    private Long issueId;
    private Long userId;
    private LocalDateTime createdAt;
}