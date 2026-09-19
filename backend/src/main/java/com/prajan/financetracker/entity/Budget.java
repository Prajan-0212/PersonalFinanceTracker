package com.prajan.financetracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.YearMonth;

@Entity
@Table(name = "budgets")
public class Budget extends BaseEntity {

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private int month;

    @Column(nullable = false)
    private int year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Budget() {
        super();
    }

    public Budget(BigDecimal amount, YearMonth month, User user) {
        super();
        this.amount = amount;
        this.month = month.getMonthValue();
        this.year = month.getYear();
        this.user = user;
    }

    public Budget(Budget other) {
        super(other.getId());
        this.amount = other.amount;
        this.month = other.month;
        this.year = other.year;
        this.user = other.user;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}