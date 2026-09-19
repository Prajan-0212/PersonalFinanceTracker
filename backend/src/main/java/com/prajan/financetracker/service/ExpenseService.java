package com.prajan.financetracker.service;

import com.prajan.financetracker.entity.Expense;
import com.prajan.financetracker.entity.User;
import com.prajan.financetracker.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CurrentUserService currentUserService;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            CurrentUserService currentUserService) {
        this.expenseRepository = expenseRepository;
        this.currentUserService = currentUserService;
    }

    public List<Expense> getAllExpenses(Long userId) {
        User user = currentUserService.requireUser(userId);
        return expenseRepository.findByUserOrderByTransactionDateDesc(user);
    }

    public Expense getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Expense not found"));

        verifyOwnership(expense.getUser());

        return expense;
    }

    public Expense createExpense(Expense expense) {
        User currentUser = currentUserService.getCurrentUser();

        // Never trust the user object sent by the frontend.
        expense.setUser(currentUser);

        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Expense not found"));

        verifyOwnership(existingExpense.getUser());

        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setTransactionDate(
                updatedExpense.getTransactionDate());
        existingExpense.setDescription(
                updatedExpense.getDescription());
        existingExpense.setCategory(
                updatedExpense.getCategory());

        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Expense not found"));

        verifyOwnership(expense.getUser());

        expenseRepository.delete(expense);
    }

    private void verifyOwnership(User owner) {
        User currentUser = currentUserService.getCurrentUser();

        if (!owner.getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another user's expense");
        }
    }
}
