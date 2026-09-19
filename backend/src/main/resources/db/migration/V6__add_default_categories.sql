INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Food', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Food'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Movie', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Movie'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Travel', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Travel'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Shopping', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Shopping'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Bills', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Bills'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Education', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Education'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Health', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Health'
);

INSERT INTO categories (name, type, created_at, updated_at)
SELECT 'Other', 'EXPENSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = 'Other'
);