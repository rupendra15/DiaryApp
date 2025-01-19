package com.confession.diary.repository;

import com.confession.diary.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// JpaRepository<Post, Long> -> Post is the model, Long is the type of the ID
public interface PostRepository extends JpaRepository<Post, Long> {
    // Find posts by category
    List<Post> findByCategory(String category);

    // Find posts by userId (for retrieving a specific user's posts)
    List<Post> findByUserId(Long userId);
}
