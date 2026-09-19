package com.prajan.financetracker.repository;

import com.prajan.financetracker.entity.Income;
import com.prajan.financetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserOrderByTransactionDateDesc(User user);
}