package com.Api.Abode.controller;

import com.Api.Abode.dto.PostRequest;
import com.Api.Abode.dto.PostResponse;
import com.Api.Abode.model.Post;
import com.Api.Abode.repository.PostRepository;
import com.Api.Abode.service.GeminiService;
import com.Api.Abode.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;
    private final GeminiService geminiService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest) {
        PostResponse postResponse = postService.save(postRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(postResponse);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.status(HttpStatus.OK).body(postService.getAllPosts());
    }

/*
    @GetMapping("/search")
    @Transactional(readOnly = true)
    public List<Post> searchPosts(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return postRepository.findAll(); // Fallback to all posts if query is empty
        }
        return postRepository.findAllWithUserAndRoom();
    }
*/

    /*@GetMapping("/search")
    public ResponseEntity<List<Post>> searchByUsername(@RequestParam String username) {
        List<Post> posts = postService.searchPostsByUsername(username);
        return ResponseEntity.ok(posts);
    }*/
}