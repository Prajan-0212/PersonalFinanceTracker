package com.prajan.financetracker.controller;

import com.prajan.financetracker.entity.User;
import com.prajan.financetracker.service.CurrentUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final CurrentUserService currentUserService;

    public UserController(
            CurrentUserService currentUserService) {

        this.currentUserService =
                currentUserService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(
            @PathVariable Long id) {

        User user =
                currentUserService.requireUser(id);

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
    }
}