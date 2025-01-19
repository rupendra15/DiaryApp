package com.confession.diary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import com.confession.diary.model.User;
import com.confession.diary.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.multipart.MultipartFile; // For MultipartFile
import java.util.Map;
import java.util.HashMap;
import java.util.Base64; // For Base64 encoding
import java.io.IOException; // For IOException handling
import org.springframework.http.HttpStatus;



import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Sign up a new user
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        // Encrypt password and save user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // Log in an existing user
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new Exception("Invalid username or password", e);
        }

        // Here, you would normally generate and return a JWT token
        return ResponseEntity.ok("User logged in successfully");
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            User foundUser = user.get();

            Map<String, Object> response = new HashMap<>();
            response.put("username", foundUser.getUsername());
            response.put("bio", foundUser.getBio());

            // Convert profile picture byte array to Base64 for frontend
            if (foundUser.getProfilePicture() != null) {
                String base64Image = Base64.getEncoder().encodeToString(foundUser.getProfilePicture());
                response.put("profilePicture", "data:image/jpeg;base64," + base64Image); // Adjust MIME type as needed
            }

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(404).body(null);
    }


    // Update user profile
    @PutMapping("/profile/{username}")
    public ResponseEntity<String> updateUserProfile(
            @PathVariable String username,
            @RequestParam("bio") String bio,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setBio(bio);  // Update bio
            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    // Save the image as a byte array
                    byte[] imageBytes = profilePicture.getBytes();
                    existingUser.setProfilePicture(imageBytes); // Save image in the user object
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Error processing the image");
                }
            }

            userRepository.save(existingUser);
            return ResponseEntity.ok("Profile updated");
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @GetMapping("/profil/{id}")
    public ResponseEntity<User> getUserProfiles(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
