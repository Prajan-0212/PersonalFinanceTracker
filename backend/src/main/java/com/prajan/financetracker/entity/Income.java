package com.prajan.financetracker.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "incomes")
public class Income extends FinancialRecord {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    public Income() {
        super();
    }

    public Income(BigDecimal amount, LocalDate transactionDate,
                  String description, User user, Category category) {
        super(amount, transactionDate, description);
        this.user = user;
        this.category = category;
    }

    public Income(Income other) {
        super(other);
        this.user = other.user;
        this.category = other.category;
    }

    @Override
    public String getRecordType() {
        return "INCOME";
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}