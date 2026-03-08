package com.civic.comment.controller;

import com.civic.comment.dto.CommentResponseDTO;
import com.civic.comment.dto.CreateCommentRequestDTO;
import com.civic.comment.service.CommentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/issues/{issueId}/comments")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable Long issueId,
            @RequestBody CreateCommentRequestDTO requestDTO) {

        return ResponseEntity.ok(commentService.createComment(issueId, requestDTO));
    }

    @GetMapping("/issues/{issueId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(
            @PathVariable Long issueId) {

        return ResponseEntity.ok(commentService.getCommentsByIssue(issueId));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {

        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}