# Personal Finance Tracker
## Java Class Design

---

# 1. Overview

The Personal Finance Tracker uses an object-oriented Java design.

The class structure is designed to demonstrate Java concepts such as:

- Classes and objects
- Encapsulation
- Constructors
- Inheritance
- Method overloading
- Method overriding
- Abstraction
- Interfaces
- Runtime polymorphism
- Collections
- Exception handling
- File I/O
- Multithreading

---

# 2. Core Classes

The major domain classes are:

- User
- Category
- Budget
- FinancialRecord
- Expense
- Income

Supporting classes will include:

- Services
- Controllers
- Repositories
- DTOs
- Exceptions
- Security components
- Utility classes

---

# 3. Class Hierarchy

```text
                 BaseEntity
                     |
                     v
              FinancialRecord
                (abstract)
                 /      \
                /        \
               v          v
           Expense       Income