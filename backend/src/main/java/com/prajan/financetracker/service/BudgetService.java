package com.prajan.financetracker.service;

import com.prajan.financetracker.entity.Budget;
import com.prajan.financetracker.entity.User;
import com.prajan.financetracker.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CurrentUserService currentUserService;

    public BudgetService(
            BudgetRepository budgetRepository,
            CurrentUserService currentUserService) {
        this.budgetRepository = budgetRepository;
        this.currentUserService = currentUserService;
    }

    public Budget saveBudget(Long userId, Budget budget) {

        User user = currentUserService.requireUser(userId);

        budget.setUser(user);

        Optional<Budget> existing = budgetRepository
                .findByUserAndMonthAndYear(
                        user,
                        budget.getMonth(),
                        budget.getYear()
                );

        if (existing.isPresent()) {
            Budget current = existing.get();
            current.setAmount(budget.getAmount());
            return budgetRepository.save(current);
        }

        return budgetRepository.save(budget);
    }

    public Budget getBudget(Long userId, YearMonth month) {

        User user = currentUserService.requireUser(userId);

        return budgetRepository
                .findByUserAndMonthAndYear(
                        user,
                        month.getMonthValue(),
                        month.getYear()
                )
                .orElse(null);
    }
}
