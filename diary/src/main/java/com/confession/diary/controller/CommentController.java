package com.confession.diary.controller;

import com.confession.diary.model.Comment;
import com.confession.diary.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // Get comments by post ID
    @GetMapping("post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable("postId") String postId) {
        try {
            Long postIdLong = Long.parseLong(postId);
            List<Comment> comments = commentRepository.findByPostId(postIdLong);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    // Create a new comment
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        comment.setCreatedAt(new Date());
        Comment savedComment = commentRepository.save(comment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable("id") Long id, @RequestBody Comment comment) {
        if (!commentRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        comment.setId(id); // Ensure the ID matches the path variable
        Comment updatedComment = commentRepository.save(comment);
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable("id") Long id) {
        if (!commentRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        commentRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
