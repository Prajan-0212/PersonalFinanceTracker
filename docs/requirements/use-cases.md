# Personal Finance Tracker
## Use Case Specification

---

## 1. Overview

This document describes the major interactions between users and the Personal Finance Tracker system.

The system contains two primary actors:

- User
- Administrator

The User interacts with the application to manage personal financial information, while the Administrator performs permitted application-level management operations.

---

# 2. Actors

## 2.1 User

The User is the primary actor of the system.

The User can:

- Register an account
- Login
- Manage profile
- Add income
- Manage income
- Add expenses
- Manage expenses
- Create and manage budgets
- View dashboard
- Analyze spending
- Generate reports
- Export reports
- Logout

---

## 2.2 Administrator

The Administrator is responsible for permitted application-level management.

The Administrator can:

- Login
- Manage users
- Manage categories
- Monitor application-level information
- Logout

---

# 3. Use Case List

| ID | Use Case | Actor |
|---|---|---|
| UC-01 | Register Account | User |
| UC-02 | Login | User |
| UC-03 | Logout | User |
| UC-04 | Manage Profile | User |
| UC-05 | Add Expense | User |
| UC-06 | View Expenses | User |
| UC-07 | Edit Expense | User |
| UC-08 | Delete Expense | User |
| UC-09 | Add Income | User |
| UC-10 | View Income | User |
| UC-11 | Edit Income | User |
| UC-12 | Delete Income | User |
| UC-13 | Manage Budget | User |
| UC-14 | View Dashboard | User |
| UC-15 | Analyze Spending | User |
| UC-16 | Generate Financial Report | User |
| UC-17 | Export Financial Report | User |
| UC-18 | Admin Login | Administrator |
| UC-19 | Manage Users | Administrator |
| UC-20 | Manage Categories | Administrator |
| UC-21 | Monitor Application | Administrator |

---

# 4. Detailed Use Cases

## UC-01 — Register Account

### Actor
User

### Purpose
Create a new account in the system.

### Preconditions
The user does not already have an account using the provided credentials.

### Main Flow

1. User opens the registration page.
2. User enters required registration information.
3. System validates the submitted information.
4. System checks whether the account already exists.
5. System securely stores the user information.
6. System confirms successful registration.

### Alternative Flow

If the submitted information is invalid, the system displays appropriate validation messages.

If an account already exists, the system informs the user.

### Postcondition

A new user account is created.

---

# UC-02 — Login

### Actor
User

### Purpose
Authenticate an existing user.

### Preconditions

The user has a registered account.

### Main Flow

1. User opens the login page.
2. User enters credentials.
3. System validates the credentials.
4. System authenticates the user.
5. System creates an authenticated session/token.
6. User is redirected to the dashboard.

### Alternative Flow

If credentials are invalid, the system displays an appropriate error message.

### Postcondition

The user is authenticated and can access authorized resources.

---

# UC-03 — Logout

### Actor
User

### Purpose
End the current authenticated session.

### Main Flow

1. User selects Logout.
2. System terminates the applicable authenticated client state.
3. User is redirected to the login page.

### Postcondition

The user can no longer access protected functionality through the previous authentication state.

---

# UC-04 — Manage Profile

### Actor
User

### Purpose
View and update permitted profile information.

### Main Flow

1. User opens the profile page.
2. System displays profile information.
3. User edits permitted information.
4. User submits the changes.
5. System validates the information.
6. System saves the changes.
7. System displays a confirmation.

---

# UC-05 — Add Expense

### Actor
User

### Purpose
Record a new expense.

### Preconditions

User is authenticated.

### Main Flow

1. User opens the Expenses page.
2. User selects Add Expense.
3. User enters:
    - Amount
    - Category
    - Date
    - Description
4. System validates the submitted data.
5. System creates the expense record.
6. System stores the record.
7. System updates relevant financial calculations.
8. System displays confirmation.

### Alternative Flow

If the amount or other required information is invalid, the system displays validation feedback.

### Postcondition

The expense is stored and associated with the authenticated user.

---

# UC-06 — View Expenses

### Actor
User

### Purpose
View previously recorded expenses.

### Main Flow

1. User opens the Expenses page.
2. System retrieves the user's expense records.
3. System displays the records.
4. User can browse the records.

### Optional Operations

The user can search or filter the displayed expenses.

---

# UC-07 — Edit Expense

### Actor
User

### Purpose
Modify an existing expense.

### Main Flow

1. User selects an expense.
2. User chooses Edit.
3. System displays the existing information.
4. User modifies the required fields.
5. System validates the changes.
6. System updates the expense.
7. System recalculates relevant financial information.

### Postcondition

The updated expense is stored.

---

# UC-08 — Delete Expense

### Actor
User

### Purpose
Remove an existing expense.

### Main Flow

1. User selects an expense.
2. User chooses Delete.
3. System requests confirmation.
4. User confirms deletion.
5. System removes the expense.
6. System updates financial calculations.

### Alternative Flow

If the user cancels the operation, the expense remains unchanged.

---

# UC-09 — Add Income

### Actor
User

### Purpose
Record a new income transaction.

### Main Flow

1. User opens the Income page.
2. User selects Add Income.
3. User enters income information.
4. System validates the information.
5. System creates the income record.
6. System stores the record.
7. System updates financial calculations.
8. System displays confirmation.

---

# UC-10 — View Income

### Actor
User

### Purpose
View previously recorded income records.

### Main Flow

1. User opens the Income page.
2. System retrieves the user's income records.
3. System displays the records.
4. User can browse the records.

---

# UC-11 — Edit Income

### Actor
User

### Purpose
Modify an existing income record.

### Main Flow

1. User selects an income record.
2. User chooses Edit.
3. System displays the existing information.
4. User modifies the information.
5. System validates the changes.
6. System updates the record.
7. System recalculates relevant financial information.

---

# UC-12 — Delete Income

### Actor
User

### Purpose
Remove an income record.

### Main Flow

1. User selects an income record.
2. User chooses Delete.
3. System requests confirmation.
4. User confirms.
5. System removes the record.
6. System updates financial calculations.

---

# UC-13 — Manage Budget

### Actor
User

### Purpose
Create and monitor a monthly budget.

### Main Flow

1. User opens the Budget page.
2. User enters a monthly budget amount.
3. System validates the amount.
4. System stores or updates the budget.
5. System calculates spending against the budget.
6. System displays:
    - Budget amount
    - Amount spent
    - Remaining amount
    - Utilization percentage
7. System indicates when spending exceeds the defined budget.

---

# UC-14 — View Dashboard

### Actor
User

### Purpose
Provide an overview of the user's current financial status.

### Main Flow

1. User logs in.
2. System loads dashboard information.
3. System calculates or retrieves:
    - Total income
    - Total expenses
    - Current balance
    - Monthly budget
    - Budget utilization
    - Remaining budget
4. System retrieves recent transactions.
5. System retrieves category-wise spending information.
6. System displays the information using cards, tables, and charts.

---

# UC-15 — Analyze Spending

### Actor
User

### Purpose
Understand spending patterns.

### Main Flow

1. User opens the Reports or Analytics page.
2. User selects an analysis period.
3. System retrieves relevant financial records.
4. System groups applicable expenses.
5. System calculates category-wise totals.
6. System calculates time-based spending information.
7. System displays the results graphically.

---

# UC-16 — Generate Financial Report

### Actor
User

### Purpose
Generate a financial summary for a selected period.

### Main Flow

1. User opens Reports.
2. User selects a reporting period.
3. System retrieves relevant income and expense records.
4. System calculates financial summaries.
5. System prepares the report.
6. System displays the generated report.

---

# UC-17 — Export Financial Report

### Actor
User

### Purpose
Export a generated financial report.

### Main Flow

1. User generates a report.
2. User selects Export.
3. System prepares the report data.
4. Java file handling functionality generates the selected export file.
5. System provides the generated file to the user.

---

# UC-18 — Admin Login

### Actor
Administrator

### Purpose
Authenticate an administrator.

### Main Flow

1. Administrator enters credentials.
2. System validates credentials.
3. System verifies the administrator role.
4. System grants authorized administrative access.

---

# UC-19 — Manage Users

### Actor
Administrator

### Purpose
Perform permitted user management operations.

### Main Flow

1. Administrator opens the user management area.
2. System retrieves permitted user information.
3. Administrator performs an authorized operation.
4. System validates the operation.
5. System applies the change.
6. System displays confirmation.

---

# UC-20 — Manage Categories

### Actor
Administrator

### Purpose
Manage application-level financial categories.

### Main Flow

1. Administrator opens category management.
2. System displays available categories.
3. Administrator adds, updates, or removes a permitted category.
4. System validates the operation.
5. System saves the change.

---

# UC-21 — Monitor Application

### Actor
Administrator

### Purpose
View permitted application-level information.

### Main Flow

1. Administrator opens the administration dashboard.
2. System retrieves relevant application information.
3. System displays permitted statistics and system information.

---

# 5. General Business Rules

### BR-01

Every financial record must belong to an authenticated user.

### BR-02

Expense amounts must be greater than zero.

### BR-03

Income amounts must be greater than zero.

### BR-04

Budget amounts must be greater than zero.

### BR-05

Users must only access their own financial records.

### BR-06

Administrative operations must require appropriate authorization.

### BR-07

Required financial fields must be validated before storage.

### BR-08

Deleting a financial record must require explicit user confirmation at the interface level.

### BR-09

Financial calculations must be updated when relevant transactions are created, modified, or deleted.

---

# 6. Summary

The use cases define the major interactions between the Personal Finance Tracker system and its users.

The design provides a structured foundation for implementing the frontend, REST APIs, backend services, database operations, authentication, reporting, testing, and final documentation.