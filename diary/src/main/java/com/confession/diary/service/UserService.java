package com.confession.diary.service;

import com.confession.diary.model.User;
import com.confession.diary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional; // Import Optional

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        // Use Optional to handle the possibility of no user found
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent() && passwordEncoder.matches(password, optionalUser.get().getPassword())) {
            return optionalUser.get(); // Return the User object if authentication succeeds
        }
        return null; // Authentication failed
    }
}
