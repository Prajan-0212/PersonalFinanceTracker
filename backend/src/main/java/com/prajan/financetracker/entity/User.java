package com.prajan.financetracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(
            nullable = false,
            unique = true,
            length = 100
    )
    private String email;

    @JsonIgnore
    @Column(
            nullable = false,
            length = 100
    )
    private String password;

    @Column(
            nullable = false,
            length = 100
    )
    private String fullName;

    @Column(
            nullable = false,
            length = 20
    )
    private String role = "USER";

    public User() {
        super();
    }

    public User(
            String email,
            String password,
            String fullName) {

        super();

        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = "USER";
    }

    public User(User other) {

        super(other.getId());

        this.email = other.email;
        this.password = other.password;
        this.fullName = other.fullName;
        this.role = other.role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}