package com.Api.Abode.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String postName;
    private String url;
    private String description;
    private String userName;
    private String roomName;
    private String username;
    private Long roomId;
    private Integer voteCount;
    private String aiSummary;

}