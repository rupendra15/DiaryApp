package com.confession.diary.repository;

import com.confession.diary.model.User; // Adjust the import based on your User model location
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Make sure this import is added


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Find user by email
    Optional<User> findByUsername(String username); // Change return type to Optional<User>
}
