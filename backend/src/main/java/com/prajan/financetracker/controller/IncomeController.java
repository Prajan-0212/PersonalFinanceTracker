package com.prajan.financetracker.controller;

import com.prajan.financetracker.entity.Income;
import com.prajan.financetracker.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")

public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Income>> getAllIncome(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                incomeService.getAllIncome(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Income> getIncomeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                incomeService.getIncomeById(id));
    }

    @PostMapping
    public ResponseEntity<Income> createIncome(
            @RequestBody Income income) {

        return ResponseEntity.ok(
                incomeService.createIncome(income));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(
            @PathVariable Long id,
            @RequestBody Income income) {

        return ResponseEntity.ok(
                incomeService.updateIncome(id, income));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(
            @PathVariable Long id) {

        incomeService.deleteIncome(id);

        return ResponseEntity.ok(
                "Income deleted successfully");
    }
}
