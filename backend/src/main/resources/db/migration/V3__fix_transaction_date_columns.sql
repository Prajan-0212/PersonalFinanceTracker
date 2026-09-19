ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS transaction_date DATE;

ALTER TABLE incomes
    ADD COLUMN IF NOT EXISTS transaction_date DATE;