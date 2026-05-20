package com.Api.Abode.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL = "YOUR_GEMINI_API";

    public String summarizePost(String content) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> prompt = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", "Summarize this Reddit post in one short sentence: " + content)
                ))
            )
        );

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL + apiKey, prompt, Map.class);
            return response.getBody().toString(); 
        } catch (Exception e) {
            return "AI Summary unavailable";
        }
    }
}