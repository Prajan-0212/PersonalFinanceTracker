package com.prajan.financetracker.service;

import com.prajan.financetracker.entity.Income;
import com.prajan.financetracker.entity.User;
import com.prajan.financetracker.repository.IncomeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final CurrentUserService currentUserService;

    public IncomeService(
            IncomeRepository incomeRepository,
            CurrentUserService currentUserService) {
        this.incomeRepository = incomeRepository;
        this.currentUserService = currentUserService;
    }

    public List<Income> getAllIncome(Long userId) {
        User user = currentUserService.requireUser(userId);

        return incomeRepository
                .findByUserOrderByTransactionDateDesc(user);
    }

    public Income createIncome(Income income) {
        User currentUser = currentUserService.getCurrentUser();

        // Never trust the user object sent by the frontend.
        income.setUser(currentUser);

        return incomeRepository.save(income);
    }

    public Income getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Income not found"));

        verifyOwnership(income.getUser());

        return income;
    }

    public Income updateIncome(Long id, Income updatedIncome) {
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Income not found"));

        verifyOwnership(existingIncome.getUser());

        existingIncome.setAmount(updatedIncome.getAmount());
        existingIncome.setTransactionDate(
                updatedIncome.getTransactionDate());
        existingIncome.setDescription(
                updatedIncome.getDescription());
        existingIncome.setCategory(
                updatedIncome.getCategory());

        return incomeRepository.save(existingIncome);
    }

    public void deleteIncome(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Income not found"));

        verifyOwnership(income.getUser());

        incomeRepository.delete(income);
    }

    private void verifyOwnership(User owner) {
        User currentUser = currentUserService.getCurrentUser();

        if (!owner.getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another user's income");
        }
    }
}