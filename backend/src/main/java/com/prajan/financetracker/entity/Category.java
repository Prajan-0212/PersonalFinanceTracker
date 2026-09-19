package com.prajan.financetracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String type;

    public Category() {
        super();
    }

    public Category(String name, String type) {
        super();
        this.name = name;
        this.type = type;
    }

    public Category(Category other) {
        super(other.getId());
        this.name = other.name;
        this.type = other.type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
