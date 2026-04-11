package com.jewellery.inventory.controller;

import com.jewellery.inventory.dto.LoginRequest;
import com.jewellery.inventory.dto.LoginResponse;
import com.jewellery.inventory.dto.SignUpRequest;
import com.jewellery.inventory.dto.ApiResponse;
import com.jewellery.inventory.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signUp(@RequestBody SignUpRequest request) {
        log.info("Sign up request for: {}", request.getEmail());
        ApiResponse response = authService.signUp(request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            log.info("Login request for: {}", request.getEmail());
            LoginResponse loginResponse = authService.login(request);
            
            // Set JWT token as HTTP-only cookie
            Cookie cookie = new Cookie("Authorization", loginResponse.getToken());
            cookie.setHttpOnly(true);  // Prevent JavaScript access
            cookie.setSecure(false);   // Set to true in production (HTTPS only)
            cookie.setPath("/");    // Set to / for global domain access
            cookie.setMaxAge(86400);   // 24 hours
            cookie.setAttribute("SameSite", "Lax");
            response.addCookie(cookie);
            
            log.info("Cookie set for user: {}", request.getEmail());
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> health() {
        return ResponseEntity.ok(new ApiResponse(true, "Auth service is healthy"));
    }
}
