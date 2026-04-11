package com.jewellery.inventory.service;

import com.jewellery.inventory.dto.LoginRequest;
import com.jewellery.inventory.dto.LoginResponse;
import com.jewellery.inventory.dto.SignUpRequest;
import com.jewellery.inventory.dto.ApiResponse;
import com.jewellery.inventory.entity.User;
import com.jewellery.inventory.repository.UserRepository;
import com.jewellery.inventory.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public ApiResponse signUp(SignUpRequest request) {
        // Validate input
        if (request.getName() == null || request.getName().isEmpty()) {
            return new ApiResponse(false, "Name is required");
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return new ApiResponse(false, "Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new ApiResponse(false, "Password is required");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new ApiResponse(false, "Passwords do not match");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already registered");
        }

        try {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.UserRole.STAFF); // Default role is STAFF

            userRepository.save(user);
            log.info("User registered successfully: {}", request.getEmail());
            return new ApiResponse(true, "User registered successfully");
        } catch (Exception e) {
            log.error("Error during sign up: {}", e.getMessage());
            return new ApiResponse(false, "Error during registration: " + e.getMessage());
        }
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().toString());
        log.info("User logged in successfully: {}", request.getEmail());
        
        return new LoginResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole().toString(),
            token
        );
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
