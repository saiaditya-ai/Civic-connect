package com.civic.comment.service;

import com.civic.comment.dto.CommentResponseDTO;
import com.civic.comment.dto.CreateCommentRequestDTO;
import com.civic.comment.model.Comment;
import com.civic.comment.repo.CommentRepository;
import com.civic.common.exception.ResourceNotFoundException;
import com.civic.issue.model.Issue;
import com.civic.issue.repo.IssueRepository;
import com.civic.user.model.User;
import com.civic.user.repo.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    @Override
    public CommentResponseDTO createComment(Long issueId, CreateCommentRequestDTO requestDTO) {

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));
        
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));

        Comment comment = Comment.builder()
                .message(requestDTO.getMessage())
                .issue(issue)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        Comment saved = commentRepository.save(comment);

        return mapToResponse(saved);
    }

    @Override
    public List<CommentResponseDTO> getCommentsByIssue(Long issueId) {

        return commentRepository.findByIssue_Id(issueId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    private CommentResponseDTO mapToResponse(Comment comment) {

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .message(comment.getMessage())
                .issueId(comment.getIssue().getId())
                .userId(comment.getUser().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}