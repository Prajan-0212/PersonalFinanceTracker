\# FinTrack - Personal Finance Tracker



A full-stack personal finance management application developed as a Java Project Based Learning (PBL) project.



FinTrack helps users manage their income, expenses, budgets and financial reports through a secure and user-friendly web application.



\---



\## 📌 Project Overview



Managing personal finances manually can make it difficult to track spending, monitor budgets and understand financial patterns.



FinTrack provides a centralized platform where users can:



\- Create and securely access their account

\- Record income

\- Record and categorize expenses

\- Create and update monthly budgets

\- View financial summaries

\- Analyze spending through charts

\- Review recent transactions

\- Manage their personal profile

\- Keep financial data isolated between users



The application follows a full-stack architecture with a React frontend, Spring Boot backend and PostgreSQL database.



\---



\## ✨ Features



\### 🔐 Authentication



\- User registration

\- User login

\- JWT-based authentication

\- Password hashing using BCrypt

\- Authenticated API access

\- User-specific data protection



\### 💰 Income Management



\- Add income records

\- View income history

\- Monthly income calculation

\- Transaction details



\### 💸 Expense Management



\- Add expenses

\- Categorize expenses

\- Delete expenses

\- View expense history

\- Monthly expense calculation

\- Category-wise spending analysis



\### 📊 Budget Management



\- Create monthly budgets

\- Update existing budgets

\- Track budget usage

\- Compare expenses against the monthly budget



\### 📈 Reports \& Dashboard



\- Total income

\- Total expenses

\- Available balance

\- Budget summary

\- Category-wise expense visualization

\- Monthly financial overview

\- Recent transactions



\### 👤 User Management



\- User profile information

\- User-specific financial records

\- Multi-user data isolation



\---



\## 🛠️ Technology Stack



\### Frontend



\- React

\- Vite

\- Tailwind CSS

\- Recharts

\- JavaScript



\### Backend



\- Java 21

\- Spring Boot

\- Spring Security

\- Spring Data JPA

\- JWT

\- Maven



\### Database



\- PostgreSQL



\### Development Tools



\- IntelliJ IDEA

\- Visual Studio Code

\- Git

\- GitHub

\- PostgreSQL



\---



\## 🏗️ System Architecture



```text

&#x20;                   ┌──────────────────────┐

&#x20;                   │       User           │

&#x20;                   └──────────┬───────────┘

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌──────────────────────┐

&#x20;                   │   React Frontend     │

&#x20;                   │  Vite + Tailwind CSS │

&#x20;                   │      Recharts        │

&#x20;                   └──────────┬───────────┘

&#x20;                              │

&#x20;                        REST API + JWT

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌──────────────────────┐

&#x20;                   │   Spring Boot API    │

&#x20;                   │                      │

&#x20;                   │ Controllers          │

&#x20;                   │ Services             │

&#x20;                   │ Repositories         │

&#x20;                   │ Security             │

&#x20;                   └──────────┬───────────┘

&#x20;                              │

&#x20;                         JPA / Hibernate

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌──────────────────────┐

&#x20;                   │     PostgreSQL       │

&#x20;                   │                      │

&#x20;                   │ Users                │

&#x20;                   │ Income               │

&#x20;                   │ Expenses             │

&#x20;                   │ Categories           │

&#x20;                   │ Budgets              │

&#x20;                   └──────────────────────┘

