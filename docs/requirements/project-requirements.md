# Personal Finance Tracker
## Project Requirements Document

### Project Title

Personal Finance Tracker — A Full-Stack Java Application for Personal Expense Management and Budget Analysis

---

## 1. Introduction

The Personal Finance Tracker is a full-stack web application designed to help users manage their personal financial activities through a centralized system.

The application allows users to record income and expenses, organize transactions into categories, create monthly budgets, monitor spending, and analyze financial activities through an interactive dashboard and reports.

The backend will be developed using Java and Spring Boot, while the frontend will use a modern component-based web framework. PostgreSQL will be used as the relational database.

The project is developed as a Java Project Based Learning (PBL) course project and therefore incorporates important Java programming concepts including object-oriented programming, constructors, inheritance, polymorphism, abstraction, interfaces, collections, exception handling, file I/O, and multithreading.

---

## 2. Problem Statement

Managing personal finances manually can make it difficult for individuals to keep track of income, expenses, budgets, and spending patterns.

Users may record transactions across different sources without having a centralized system to organize and analyze their financial activities.

The proposed Personal Finance Tracker provides a centralized web-based application for recording income and expenses, managing monthly budgets, monitoring financial status, and visualizing spending patterns through an interactive dashboard.

---

## 3. Aim

To design and develop a user-friendly full-stack personal finance management application using Java and modern web technologies for recording, organizing, monitoring, and analyzing personal financial transactions.

---

## 4. Objectives

1. Develop a centralized application for managing personal income and expenses.
2. Allow users to create and monitor monthly budgets.
3. Automatically calculate total income, total expenses, remaining balance, and budget utilization.
4. Provide category-wise and time-based spending analysis.
5. Develop a responsive and accessible user interface.
6. Develop the backend using Java and Spring Boot following a layered architecture.
7. Store financial information using a relational PostgreSQL database.
8. Apply core Java concepts throughout the implementation.
9. Implement secure user authentication and role-based authorization.
10. Provide financial reports and export functionality.
11. Test the application using unit testing and API testing.
12. Deploy the application using appropriate software development and DevOps practices.

---

# 5. Target Users

## 5.1 Normal User

A normal user can:

- Register an account.
- Log in securely.
- Manage income records.
- Manage expense records.
- Create and manage monthly budgets.
- View financial summaries.
- View spending analysis.
- Generate reports.
- Export reports.
- Manage their profile.

## 5.2 Administrator

An administrator can:

- Log in using an authorized administrator account.
- Manage application-level categories.
- View system-level information.
- Manage user accounts where permitted.
- Monitor application functionality.

---

# 6. Functional Requirements

## 6.1 Authentication and Authorization

### FR-01
The system shall allow a new user to register an account.

### FR-02
The system shall allow registered users to log in.

### FR-03
The system shall validate user credentials during authentication.

### FR-04
The system shall provide authenticated access to protected resources.

### FR-05
The system shall implement role-based authorization.

### FR-06
The system shall allow users to log out.

---

## 6.2 Expense Management

### FR-07
The system shall allow users to add an expense.

### FR-08
The system shall allow users to view their expenses.

### FR-09
The system shall allow users to edit an existing expense.

### FR-10
The system shall allow users to delete an expense.

### FR-11
The system shall allow users to categorize expenses.

### FR-12
The system shall allow users to search expenses.

### FR-13
The system shall allow users to filter expenses by relevant criteria such as category and date.

### FR-14
The system shall calculate total expenses.

---

## 6.3 Income Management

### FR-15
The system shall allow users to add income records.

### FR-16
The system shall allow users to view income records.

### FR-17
The system shall allow users to edit income records.

### FR-18
The system shall allow users to delete income records.

### FR-19
The system shall allow users to categorize income records.

### FR-20
The system shall calculate total income.

---

## 6.4 Budget Management

### FR-21
The system shall allow users to create a monthly budget.

### FR-22
The system shall allow users to update their budget.

### FR-23
The system shall display the current budget.

### FR-24
The system shall calculate budget utilization.

### FR-25
The system shall calculate the remaining budget.

### FR-26
The system shall identify when spending exceeds the defined budget.

---

## 6.5 Dashboard

### FR-27
The system shall display total income.

### FR-28
The system shall display total expenses.

### FR-29
The system shall display the current balance.

### FR-30
The system shall display budget status.

### FR-31
The system shall display recent financial transactions.

### FR-32
The system shall display category-wise spending information.

### FR-33
The system shall provide graphical financial summaries.

---

## 6.6 Reports and Analytics

### FR-34
The system shall generate monthly financial reports.

### FR-35
The system shall provide category-wise spending analysis.

### FR-36
The system shall provide spending trends over time.

### FR-37
The system shall allow users to export financial reports.

---

## 6.7 Profile Management

### FR-38
The system shall allow users to view their profile.

### FR-39
The system shall allow users to update permitted profile information.

---

# 7. Non-Functional Requirements

## 7.1 Usability

The system should provide a clear and easy-to-understand interface for users with different levels of technical experience.

## 7.2 Performance

The application should provide responsive interaction for normal user operations.

## 7.3 Security

User credentials and financial information should be protected using appropriate authentication, authorization, validation, and secure data handling mechanisms.

## 7.4 Accessibility

The user interface should follow practical accessibility principles including readable typography, sufficient contrast, meaningful labels, keyboard-friendly interaction, and clear error messages.

## 7.5 Responsiveness

The application should adapt to desktop, tablet, and mobile screen sizes.

## 7.6 Reliability

The application should handle invalid input and expected application errors without terminating unexpectedly.

## 7.7 Maintainability

The backend should follow a layered architecture separating controllers, services, repositories, and data models.

## 7.8 Scalability

The application architecture should allow additional financial features to be added without major restructuring.

---

# 8. Core Modules

The application will contain the following major modules:

1. Authentication
2. User Management
3. Expense Management
4. Income Management
5. Budget Management
6. Category Management
7. Dashboard
8. Reports and Analytics
9. Profile Management
10. Administration

---

# 9. Proposed Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Recharts

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Jakarta Validation
- Maven

## Database

- PostgreSQL
- Hibernate / JPA
- Flyway

## Testing

- JUnit 5
- Mockito
- Postman

## Development Tools

- IntelliJ IDEA
- Visual Studio Code
- Git
- GitHub
- Figma

## Deployment and DevOps

- Docker
- GitHub Actions
- Cloud deployment services

---

# 10. Java Concepts Demonstrated

The project will intentionally demonstrate the following Java concepts:

## Object-Oriented Programming

- Classes and objects
- Encapsulation
- Inheritance
- Polymorphism
- Abstraction

## Constructors

- Default constructors
- Parameterized constructors
- Copy constructors

## Inheritance

- Single inheritance
- Multilevel inheritance
- Hierarchical inheritance

## Polymorphism

- Method overloading
- Method overriding

## Abstraction

- Abstract classes
- Interfaces

## Collections

- List
- Set
- Map

## Exception Handling

- try-catch-finally
- Custom exceptions

## File Handling

- File reading
- File writing
- Report export

## Multithreading

- Background processing
- ExecutorService or equivalent controlled task execution

---

# 11. Proposed User Interface Pages

The application will contain:

1. Login
2. Registration
3. Dashboard
4. Expenses
5. Income
6. Budget
7. Reports
8. Profile
9. Administration

---

# 12. Dashboard Information

The dashboard will provide a quick overview of:

- Total income
- Total expenses
- Current balance
- Monthly budget
- Budget utilization
- Remaining budget
- Recent transactions
- Category-wise spending
- Spending trends

---

# 13. Security Requirements

The system will use:

- Password-based authentication
- JWT-based authentication
- Role-based access control
- Protected API endpoints
- Input validation
- Secure handling of user-specific data

---

# 14. Proposed Backend Architecture

The backend will follow a layered architecture:

Frontend
↓
REST API
↓
Controller Layer
↓
Service Layer
↓
Repository Layer
↓
PostgreSQL Database

The major backend packages will include:

- controller
- service
- repository
- entity
- dto
- exception
- security
- config
- util

---

# 15. Proposed Core Domain Classes

The initial domain model will contain:

- User
- Expense
- Income
- Budget
- Category
- FinancialRecord
- BaseEntity

Additional supporting classes and interfaces will be introduced when required.

---

# 16. Java Class Hierarchy

The project will use a meaningful inheritance structure:

BaseEntity
↓
FinancialRecord (Abstract)
├── Expense
└── Income

This hierarchy will be used to demonstrate inheritance, abstraction, method overriding, and polymorphism in a meaningful application context.

---

# 17. Data Collections

The application will demonstrate:

### List

Used for ordered financial transaction collections.

### Set

Used for maintaining unique categories or tags where appropriate.

### Map

Used for category-wise financial calculations such as:

Category → Total Amount

---

# 18. Exception Handling

The project will define meaningful application-specific exceptions such as:

- InvalidExpenseException
- BudgetExceededException
- ResourceNotFoundException

These exceptions will be handled through appropriate backend exception-handling mechanisms.

---

# 19. File I/O

File I/O will be used for financial report export functionality.

Example:

User requests report
↓
Report generated
↓
Java File I/O
↓
Report file created

---

# 20. Multithreading

A controlled background task may be used for operations such as report generation or other non-blocking processing.

The implementation will use Java concurrency utilities such as ExecutorService where appropriate.

---

# 21. Testing Strategy

The project will include:

### Unit Testing

- Constructor tests
- Calculation tests
- Service tests
- Exception tests
- Inheritance and polymorphism tests

### API Testing

- Authentication APIs
- Expense APIs
- Income APIs
- Budget APIs
- Report APIs

### UI Testing

- Form validation
- Navigation
- Responsive behavior
- CRUD operations
- Error and loading states

---

# 22. Deployment Strategy

The application will be designed for deployment as separate frontend, backend, and database components.

Frontend:
React application

Backend:
Spring Boot application

Database:
PostgreSQL

Environment-specific configuration will be managed using environment variables.

---

# 23. Future Enhancements

Possible future enhancements include:

- Recurring transactions
- Advanced financial goals
- Notification system
- More detailed financial analytics
- Importing transactions from supported files
- Additional report formats
- Mobile application
- Optional intelligent financial insights

These features are considered future scope and will not be included unless they are required for the core project.

---

# 24. Project Success Criteria

The project will be considered successfully implemented when:

1. Users can securely register and log in.
2. Users can manage income and expenses.
3. Users can create and monitor budgets.
4. The dashboard displays meaningful financial summaries.
5. Users can analyze spending by category and time.
6. Reports can be generated and exported.
7. Financial data is stored reliably in PostgreSQL.
8. Backend APIs follow a layered Spring Boot architecture.
9. Core Java concepts required by the PBL course are demonstrably implemented.
10. The application is tested and documented.
11. The user interface is responsive and accessible.
12. The final implementation can be demonstrated through a working end-to-end workflow.

---

## Document Status

Version: 1.0

Status: Initial Requirements Specification

Project: Personal Finance Tracker

Course Context: Java Project Based Learning