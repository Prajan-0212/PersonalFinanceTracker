package com.prajan.financetracker.controller;

import com.prajan.financetracker.entity.User;
import com.prajan.financetracker.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtEncoder jwtEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "An account with this email already exists"
                    ));
        }

        User user = new User();

        user.setFullName(
                request.fullName().trim()
        );

        user.setEmail(email);

        /*
         * NEVER store the original password.
         * Store the BCrypt hashed password instead.
         */
        user.setPassword(
                passwordEncoder.encode(
                        request.password()
                )
        );

        user.setRole("USER");

        User savedUser =
                userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new UserResponse(
                                savedUser.getId(),
                                savedUser.getFullName(),
                                savedUser.getEmail(),
                                savedUser.getRole()
                        )
                );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    request.password()
                            )
                    );

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new BadCredentialsException(
                                            "Invalid email or password"
                                    )
                            );

            String token =
                    generateToken(
                            user,
                            authentication
                    );

            return ResponseEntity.ok(
                    new LoginResponse(
                            token,
                            new UserResponse(
                                    user.getId(),
                                    user.getFullName(),
                                    user.getEmail(),
                                    user.getRole()
                            )
                    )
            );

        } catch (BadCredentialsException ex) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }
    }

    // =========================================================
    // CURRENT USER
    // =========================================================

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Authentication required"
                            )
                    );
        }

        String email =
                authentication.getName()
                        .trim()
                        .toLowerCase();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return ResponseEntity.ok(
                new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }

    // =========================================================
    // JWT GENERATION
    // =========================================================

    private String generateToken(
            User user,
            Authentication authentication) {

        Instant now = Instant.now();

        JwtClaimsSet claims =
                JwtClaimsSet.builder()
                        .issuer("fintrack")
                        .subject(user.getEmail())
                        .issuedAt(now)
                        .expiresAt(
                                now.plusMillis(
                                        jwtExpiration
                                )
                        )
                        .claim(
                                "uid",
                                user.getId()
                        )
                        .claim(
                                "name",
                                user.getFullName()
                        )
                        .claim(
                                "role",
                                user.getRole()
                        )
                        .build();

        /*
         * IMPORTANT:
         * JwsHeader is from:
         * org.springframework.security.oauth2.jwt.JwsHeader
         */
        JwsHeader header =
                JwsHeader
                        .with(MacAlgorithm.HS256)
                        .build();

        return jwtEncoder
                .encode(
                        JwtEncoderParameters.from(
                                header,
                                claims
                        )
                )
                .getTokenValue();
    }

    // =========================================================
    // REQUEST / RESPONSE DTOs
    // =========================================================

    public record RegisterRequest(

            @NotBlank(
                    message = "Full name is required"
            )
            @Size(
                    min = 2,
                    max = 100,
                    message = "Full name must be between 2 and 100 characters"
            )
            String fullName,

            @NotBlank(
                    message = "Email is required"
            )
            @Email(
                    message = "Enter a valid email address"
            )
            @Size(max = 100)
            String email,

            @NotBlank(
                    message = "Password is required"
            )
            @Size(
                    min = 6,
                    max = 100,
                    message = "Password must contain at least 6 characters"
            )
            String password

    ) {
    }

    public record LoginRequest(

            @NotBlank(
                    message = "Email is required"
            )
            @Email(
                    message = "Enter a valid email address"
            )
            String email,

            @NotBlank(
                    message = "Password is required"
            )
            String password

    ) {
    }

    public record UserResponse(
            Long id,
            String fullName,
            String email,
            String role
    ) {
    }

    public record LoginResponse(
            String token,
            UserResponse user
    ) {
    }
}
