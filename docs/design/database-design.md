# Personal Finance Tracker
## Database Design

---

# 1. Database Overview

The Personal Finance Tracker will use PostgreSQL as its relational database management system.

The database stores structured information related to:

- Users
- Categories
- Expenses
- Income
- Budgets

The database design uses primary keys, foreign keys, constraints, and relational associations to maintain data consistency.

---

# 2. Tables

The initial database contains the following tables:

1. users
2. categories
3. expenses
4. incomes
5. budgets

---

# 3. Users Table

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGSERIAL | PRIMARY KEY | Unique user identifier |
| name | VARCHAR | NOT NULL | User name |
| email | VARCHAR | NOT NULL, UNIQUE | Login email |
| password | VARCHAR | NOT NULL | Password hash |
| role | VARCHAR | NOT NULL | USER or ADMIN |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

---

# 4. Categories Table

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGSERIAL | PRIMARY KEY | Unique category identifier |
| name | VARCHAR | NOT NULL | Category name |
| type | VARCHAR | NOT NULL | EXPENSE or INCOME |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |

---

# 5. Expenses Table

| Column | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGSERIAL | PRIMARY KEY | Unique expense identifier |
| user_id | BIGINT | FOREIGN KEY | Owner of the expense |
| category_id | BIGINT | FOREIGN KEY | Expense category |
| amount | NUMERIC | NOT NULL | Expense amount |
| description | VARCHAR |  | Expense description |
| expense_date | DATE | NOT NULL | Date of expense |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

Relationship:

```text
users (1) ────────── (N) expenses
categories (1) ──── (N) expenses