-- V5: Cleanup legacy columns and align income table with the current entity model

ALTER TABLE users
DROP COLUMN IF EXISTS name;

ALTER TABLE expenses
DROP COLUMN IF EXISTS expense_date;

ALTER TABLE incomes
DROP COLUMN IF EXISTS income_date;

ALTER TABLE incomes
    ALTER COLUMN category_id DROP NOT NULL;