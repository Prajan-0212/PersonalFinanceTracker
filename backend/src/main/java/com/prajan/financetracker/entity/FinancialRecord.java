package com.prajan.financetracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

import java.math.BigDecimal;
import java.time.LocalDate;

@MappedSuperclass
public abstract class FinancialRecord extends BaseEntity {

    @Column(nullable = false, precision = 12, scale = 2)
    protected BigDecimal amount;

    @Column(nullable = false)
    protected LocalDate transactionDate;

    @Column(length = 500)
    protected String description;

    public FinancialRecord() {
        super();
    }

    public FinancialRecord(BigDecimal amount, LocalDate transactionDate, String description) {
        super();
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.description = description;
    }

    public FinancialRecord(FinancialRecord other) {
        super(other.getId());
        this.amount = other.amount;
        this.transactionDate = other.transactionDate;
        this.description = other.description;
    }

    public abstract String getRecordType();

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}