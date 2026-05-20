package com.Api.Abode.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {
    private Long postId;
    private String roomName;
    private String postName;
    private String url;
    private String description;
    private String aiSummary;
}