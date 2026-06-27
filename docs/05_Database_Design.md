# Database Design

## Overview

Family Finance OS (PFOS) uses Google Spreadsheet as its primary database.

The database is designed to support long-term scalability while maintaining simplicity and performance.

Each worksheet represents a single entity within the system.

---

# Spreadsheet Information

Database Engine

Google Spreadsheet

Backend

Google Apps Script

Relationship

Application Level

Primary Key

UUID

---

# Planned Worksheets

## Master Data

- Members
- Profiles
- Accounts
- Categories
- Budgets
- Goals
- Assets
- Liabilities
- Subscriptions
- Recurring Bills

---

## Transaction Data

- Transactions

---

## System Data

- Settings
- Notifications
- Activity Logs
- Audit Logs

---

## Reporting Data

- Monthly Closing
- Yearly Closing

---

# Members Sheet

Purpose

Store all family members.

Main Fields

- Member ID
- Full Name
- Role
- Status
- Created At
- Updated At

---

# Profiles Sheet

Purpose

Store financial profiles.

Available Profiles

- Personal
- Family

Main Fields

- Profile ID
- Profile Name
- Owner
- Status

---

# Accounts Sheet

Purpose

Store financial accounts.

Examples

- BCA Nyoman
- BNI Retno
- Cash
- E-Wallet

Main Fields

- Account ID
- Account Name
- Owner
- Balance
- Currency
- Status

---

# Categories Sheet

Purpose

Store income and expense categories.

Examples

Income

- Salary
- Bonus
- Investment

Expense

- Food
- Transportation
- Electricity
- Internet

Main Fields

- Category ID
- Category Name
- Type
- Status

---

# Transactions Sheet

Purpose

Store every financial transaction.

Required Fields

- Transaction ID
- Date
- Profile
- Paid By
- Account
- Category
- Type
- Amount
- Description
- Created At
- Updated At

---

# Budgets Sheet

Purpose

Store budgeting information.

Main Fields

- Budget ID
- Profile
- Category
- Period
- Budget Amount
- Remaining Amount

---

# Goals Sheet

Purpose

Store savings goals.

Main Fields

- Goal ID
- Goal Name
- Profile
- Target Amount
- Current Amount
- Target Date
- Status

---

# Assets Sheet

Purpose

Store owned assets.

Main Fields

- Asset ID
- Asset Name
- Category
- Value
- Owner

---

# Liabilities Sheet

Purpose

Store debts and obligations.

Main Fields

- Liability ID
- Liability Name
- Balance
- Due Date
- Owner

---

# Settings Sheet

Purpose

Store application settings.

Examples

- Currency
- Theme
- Language
- Notification Settings

---

# Activity Logs Sheet

Purpose

Store user activity history.

Examples

- Login
- Logout
- Create Transaction
- Update Budget

---

# Audit Logs Sheet

Purpose

Store immutable audit records.

Tracked Actions

- Create
- Update
- Delete

Audit logs must never be edited manually.

---

# Database Principles

- UUID for every primary key
- No duplicate records
- Soft delete where applicable
- Audit logging enabled
- Data validation required
- Referential integrity maintained by application logic

---

# Future Expansion

The database design supports additional worksheets without requiring structural changes to existing modules.