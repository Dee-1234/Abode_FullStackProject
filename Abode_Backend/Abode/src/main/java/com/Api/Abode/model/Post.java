package com.Api.Abode.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.lang.Nullable;

import java.time.Instant;

@Data
@Entity
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Post Name cannot be empty or null")
    private String postName;

    @Nullable
    private String url;

    @Nullable
    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Nullable
    @Lob
    private String description;

    @Builder.Default
    private Integer voteCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;

    private Instant createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roomId", referencedColumnName = "id")
    private Room room;


}