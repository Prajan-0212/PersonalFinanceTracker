# Personal Finance Tracker
## System Architecture

---

# 1. Architecture Overview

The Personal Finance Tracker follows a layered full-stack architecture.

The major components are:

1. React Frontend
2. Spring Boot REST Backend
3. PostgreSQL Database

The frontend communicates with the backend through REST APIs using JSON.

The backend processes requests using a layered architecture consisting of:

- Controller Layer
- Service Layer
- Repository Layer
- Database Layer

---

# 2. High-Level Architecture

```text
                    ┌───────────────────────┐
                    │       USER            │
                    │  Browser / Mobile Web │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   React Frontend      │
                    │                       │
                    │ Dashboard              │
                    │ Expenses               │
                    │ Income                 │
                    │ Budget                 │
                    │ Reports                │
                    │ Profile                │
                    └───────────┬───────────┘
                                │
                           HTTPS / REST
                                │
                                ▼
              ┌──────────────────────────────────┐
              │        Spring Boot Backend       │
              │                                  │
              │  ┌────────────────────────────┐  │
              │  │ Controller Layer           │  │
              │  └──────────────┬─────────────┘  │
              │                 ▼                │
              │  ┌────────────────────────────┐  │
              │  │ Service Layer              │  │
              │  └──────────────┬─────────────┘  │
              │                 ▼                │
              │  ┌────────────────────────────┐  │
              │  │ Repository Layer           │  │
              │  └──────────────┬─────────────┘  │
              └─────────────────┼────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      PostgreSQL       │
                    │       Database        │
                    └───────────────────────┘