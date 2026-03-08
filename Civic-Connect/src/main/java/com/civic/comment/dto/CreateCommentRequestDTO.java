package com.civic.comment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCommentRequestDTO {

    private String message;
    private Long userId;
}