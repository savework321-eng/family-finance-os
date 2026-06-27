# Business Rules

## Introduction

This document defines the official business rules for Family Finance OS (PFOS). Every module in the system must follow these rules to ensure consistency across the application.

---

# 1. Financial Profiles

PFOS supports multiple financial profiles.

Available profiles:

- Personal
- Family

Every transaction must belong to exactly one profile.

---

# 2. Family Members

Current members:

- Owner
- Partner

Future versions may support additional members such as children.

Each member has:

- Personal budget
- Personal transactions
- Personal goals
- Personal accounts
- Personal reports

---

# 3. Account Ownership

Every financial account belongs to one member.

Examples:

- BCA Nyoman
- BNI Retno
- Cash Nyoman
- Cash Family

Each account maintains its own balance.

---

# 4. Transaction Rules

Every transaction must contain:

- Transaction Date
- Profile
- Paid By
- Account Used
- Category
- Amount
- Transaction Type
- Description

Transactions cannot be saved if any required information is missing.

---

# 5. Income

Income increases the balance of the selected account.

Income affects:

- Account Balance
- Reports
- Cash Flow

---

# 6. Expense

Expenses decrease the balance of the selected account.

Expenses affect:

- Account Balance
- Budget
- Reports
- Cash Flow

---

# 7. Budget

Budgets are managed separately for:

- Personal Profile
- Family Profile

Expenses reduce the available budget.

Income does not increase the budget automatically.

---

# 8. Goals

Goals may belong to:

- Personal
- Family

Each goal contains:

- Target Amount
- Current Amount
- Target Date
- Status

Goal progress is calculated automatically.

---

# 9. Assets

Assets increase Net Worth.

Examples:

- Cash
- Savings
- Property
- Vehicle
- Investments

---

# 10. Liabilities

Liabilities reduce Net Worth.

Examples:

- Mortgage
- Personal Loan
- Credit Card

---

# 11. Reports

Reports are generated from recorded transactions.

Reports include:

- Income Report
- Expense Report
- Cash Flow
- Budget Report
- Net Worth Report

---

# 12. Audit Rules

Every data modification must be logged.

Tracked activities include:

- Create
- Update
- Delete

Audit logs cannot be modified manually.

---

# 13. Security Rules

Users may only access data according to their permissions.

Owner has full access.

Partner has access based on assigned permissions.

---

# 14. Closing Process

Monthly Closing:

- Lock monthly data
- Generate reports
- Save financial snapshot

Yearly Closing:

- Generate annual reports
- Save yearly snapshot

---

# 15. Data Integrity

The system must prevent:

- Duplicate transactions
- Invalid account references
- Negative balances where prohibited
- Missing required data