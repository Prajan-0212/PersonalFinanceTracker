package com.prajan.financetracker.controller;

import com.prajan.financetracker.entity.Budget;
import com.prajan.financetracker.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/budget")

public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Budget> saveBudget(
            @PathVariable Long userId,
            @RequestBody Budget budget) {

        return ResponseEntity.ok(
                budgetService.saveBudget(userId, budget));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Budget> getBudget(
            @PathVariable Long userId,
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                budgetService.getBudget(
                        userId,
                        YearMonth.of(year, month)
                ));
    }
}
