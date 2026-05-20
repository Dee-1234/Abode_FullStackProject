package com.Api.Abode.service;

import com.Api.Abode.dto.PostRequest;
import com.Api.Abode.dto.PostResponse;
import com.Api.Abode.model.Post;
import com.Api.Abode.model.Room;
import com.Api.Abode.model.User;
import com.Api.Abode.repository.PostRepository;
import com.Api.Abode.repository.RoomRepository;
import com.Api.Abode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public PostResponse save(PostRequest postRequest) {
        Room room = roomRepository.findByName(postRequest.getRoomName())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Post post = Post.builder()
                .postName(postRequest.getPostName())
                .url(postRequest.getUrl())
                .description(postRequest.getDescription())
                .user(currentUser)
                .room(room)
                .createdDate(Instant.now())
                .voteCount(0)
                .build();
        if (post.getDescription() != null && !post.getDescription().isBlank()) {
            String summary = geminiService.summarizePost(post.getDescription());
            post.setAiSummary(summary);
        }
        Post savedPost = postRepository.save(post);
        return mapToDto(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PostResponse mapToDto(Post post) {
        return new PostResponse(
                post.getId(),
                post.getPostName(),
                post.getUrl(),
                post.getDescription(),
                post.getUser().getUsername(),
                post.getRoom().getName(),
                post.getUser().getUsername(),
                post.getRoom().getId(),
                post.getVoteCount(),
                post.getAiSummary()
        );
    }

    /*@Transactional(readOnly = true)
    public List<Post> searchPostsByUsername(String username) {
        return postRepository.findByUser_UsernameContainingIgnoreCase(username);
    }*/
}