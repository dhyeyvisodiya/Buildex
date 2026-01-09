package com.buildex.controller;

import com.buildex.entity.User;
import com.buildex.repository.UserRepository;
import com.buildex.service.EmailService;
import com.buildex.service.OtpService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email already exists"));
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFull_name());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setStatus("pending_verification");

        userRepository.save(user);

        // Generate and Send OTP
        String otp = otpService.generateOtp(user.getEmail());
        // In a real scenario, handle email failure. Here we assume success or user can
        // resend.
        // For local testing without SMTP, we might want to log the OTP.
        System.out.println("DEBUG OTP for " + user.getEmail() + ": " + otp);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Continue to allow testing (OTP printed in console)
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent to email"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired OTP"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        User user = userOpt.get();
        user.setStatus("active");
        userRepository.save(user);

        // Return user info (excluding password)
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("full_name", user.getFullName());
        userData.put("phone", user.getPhone());
        userData.put("role", user.getRole());

        return ResponseEntity.ok(Map.of("success", true, "user", userData));
    }

    @Data
    static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String full_name;
        private String phone;
        private String role;
    }

    @Data
    static class VerifyRequest {
        private String email;
        private String otp;
    }
}
