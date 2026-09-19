package com.prajan.financetracker.repository;

import com.prajan.financetracker.entity.Budget;
import com.prajan.financetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserAndMonthAndYear(
            User user,
            int month,
            int year
    );
}
