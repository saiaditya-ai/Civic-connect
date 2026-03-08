package com.civic.comment.service;

import com.civic.comment.dto.CommentResponseDTO;
import com.civic.comment.dto.CreateCommentRequestDTO;

import java.util.List;

public interface CommentService {

    CommentResponseDTO createComment(Long issueId, CreateCommentRequestDTO requestDTO);

    List<CommentResponseDTO> getCommentsByIssue(Long issueId);

    void deleteComment(Long commentId);
}