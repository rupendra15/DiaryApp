package com.confession.diary.controller;

import com.confession.diary.model.Post;
import com.confession.diary.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        System.out.println("user id "+post.getUserId() +"post "+post);
        post.setCreatedAt(new java.util.Date());
        post.setUserId(post.getUserId());
        post.setTitle(post.getTitle());
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    // Get all posts
    @GetMapping("/all")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get posts by category (filter)
    @GetMapping("/category/{category}")
    public List<Post> getPostsByCategory(@PathVariable String category) {
        return postRepository.findByCategory(category);
    }

    // Get posts by user ID (filter by user)
    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable Long userId) {
        return postRepository.findByUserId(userId);
    }


    @GetMapping("/user-posts/{userId}")
    public ResponseEntity<?> getUserPostsByDay(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer day) {
        List<Post> posts = postRepository.findByUserId(userId);

        // Apply date filtering if year, month, or day is provided
        if (year != null) {
            posts = posts.stream()
                    .filter(post -> convertToLocalDate(post.getCreatedAt()).getYear() == year)
                    .collect(Collectors.toList());
        }
        if (month != null) {
            posts = posts.stream()
                    .filter(post -> convertToLocalDate(post.getCreatedAt()).getMonthValue() == month)
                    .collect(Collectors.toList());
        }
        if (day != null) {
            posts = posts.stream()
                    .filter(post -> convertToLocalDate(post.getCreatedAt()).getDayOfMonth() == day)
                    .collect(Collectors.toList());
        }

        Map<LocalDate, List<Post>> postsByDay = posts.stream()
                .collect(Collectors.groupingBy(post -> convertToLocalDate(post.getCreatedAt())));
        return ResponseEntity.ok(postsByDay);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setLikes(post.getLikes() + 1);
            postRepository.save(post);
            return ResponseEntity.ok(post.getLikes());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }

    private LocalDate convertToLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }



}
