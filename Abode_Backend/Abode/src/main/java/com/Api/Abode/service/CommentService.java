package com.Api.Abode.service;

import com.Api.Abode.dto.CommentsDto;
import com.Api.Abode.exceptions.PostNotFoundException;
import com.Api.Abode.model.Comment;
import com.Api.Abode.model.Post;
import com.Api.Abode.repository.CommentRepository;
import com.Api.Abode.repository.PostRepository;
import com.Api.Abode.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class CommentService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final CommentRepository commentRepository;

    public void save(CommentsDto commentsDto) {
        Post post = postRepository.findById(commentsDto.getPostId())
                .orElseThrow(() -> new PostNotFoundException(commentsDto.getPostId().toString()));
        
        Comment comment = new Comment();
        comment.setText(commentsDto.getText());
        comment.setPost(post);
        comment.setCreatedDate(Instant.now());
        comment.setUser(authService.getCurrentUser());
        
        commentRepository.save(comment);
    }

    public List<CommentsDto> getAllCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId.toString()));
        return commentRepository.findByPost(post)
                .stream()
                .map(this::mapToDto).toList();
    }

    private CommentsDto mapToDto(Comment comment) {
        CommentsDto commentsDto = new CommentsDto();
        commentsDto.setId(comment.getId());
        commentsDto.setPostId(comment.getPost().getId());
        commentsDto.setText(comment.getText());
        commentsDto.setCreatedDate(comment.getCreatedDate());
        commentsDto.setUserName(comment.getUser().getUsername());
        return commentsDto;
    }
}