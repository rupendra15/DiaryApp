package com.confession.diary.service;

import com.confession.diary.model.User;
import com.confession.diary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority; // For GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority; // For SimpleGrantedAuthority
import java.util.List; // For List

import java.util.ArrayList;
import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository; // Ensure this is correctly autowired

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        System.out.println("username is - " + username);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get(); // Retrieve the User object

            // Create a list of authorities (roles)
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // Assign default role

            // Return the user with authorities (roles)
            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }


    public boolean validateUser(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        System.out.println("optionalUser is -"+optionalUser);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get(); // Retrieve the User object
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Create local instance
            return passwordEncoder.matches(password, user.getPassword()); // Use local passwordEncoder
        }
        return false; // User not found
    }
}
