-- ==========================================
-- Personal Finance Tracker
-- V1 Initial Database Schema
-- ==========================================

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(150) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL DEFAULT 'USER',
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT chk_users_role
                           CHECK (role IN ('USER', 'ADMIN'))
);

CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            type VARCHAR(20) NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT chk_categories_type
                                CHECK (type IN ('EXPENSE', 'INCOME')),

                            CONSTRAINT uq_categories_name_type
                                UNIQUE (name, type)
);

CREATE TABLE expenses (
                          id BIGSERIAL PRIMARY KEY,
                          user_id BIGINT NOT NULL,
                          category_id BIGINT NOT NULL,
                          amount NUMERIC(12, 2) NOT NULL,
                          description VARCHAR(500),
                          expense_date DATE NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT chk_expenses_amount
                              CHECK (amount > 0),

                          CONSTRAINT fk_expenses_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users(id)
                                  ON DELETE CASCADE,

                          CONSTRAINT fk_expenses_category
                              FOREIGN KEY (category_id)
                                  REFERENCES categories(id)
);

CREATE TABLE incomes (
                         id BIGSERIAL PRIMARY KEY,
                         user_id BIGINT NOT NULL,
                         category_id BIGINT NOT NULL,
                         amount NUMERIC(12, 2) NOT NULL,
                         description VARCHAR(500),
                         income_date DATE NOT NULL,
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT chk_incomes_amount
                             CHECK (amount > 0),

                         CONSTRAINT fk_incomes_user
                             FOREIGN KEY (user_id)
                                 REFERENCES users(id)
                                 ON DELETE CASCADE,

                         CONSTRAINT fk_incomes_category
                             FOREIGN KEY (category_id)
                                 REFERENCES categories(id)
);

CREATE TABLE budgets (
                         id BIGSERIAL PRIMARY KEY,
                         user_id BIGINT NOT NULL,
                         amount NUMERIC(12, 2) NOT NULL,
                         month INTEGER NOT NULL,
                         year INTEGER NOT NULL,
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT chk_budgets_amount
                             CHECK (amount > 0),

                         CONSTRAINT chk_budgets_month
                             CHECK (month BETWEEN 1 AND 12),

    CONSTRAINT chk_budgets_year
        CHECK (year BETWEEN 2000 AND 2100),

    CONSTRAINT fk_budgets_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_budgets_user_month_year
        UNIQUE (user_id, month, year)
);

CREATE INDEX idx_expenses_user_id
    ON expenses(user_id);

CREATE INDEX idx_expenses_category_id
    ON expenses(category_id);

CREATE INDEX idx_expenses_date
    ON expenses(expense_date);

CREATE INDEX idx_incomes_user_id
    ON incomes(user_id);

CREATE INDEX idx_incomes_category_id
    ON incomes(category_id);

CREATE INDEX idx_incomes_date
    ON incomes(income_date);

CREATE INDEX idx_budgets_user_id
    ON budgets(user_id);