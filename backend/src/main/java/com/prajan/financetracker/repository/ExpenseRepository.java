package com.prajan.financetracker.repository;

import com.prajan.financetracker.entity.Expense;
import com.prajan.financetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByTransactionDateDesc(User user);
}