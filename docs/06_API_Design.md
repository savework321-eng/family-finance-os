# API Design

## Overview

PFOS uses Google Apps Script as the backend API.

Every request from the frontend must pass through the Controller Layer before reaching the Service Layer.

---

# API Architecture

Frontend

↓

Controller

↓

Service

↓

Repository

↓

Google Spreadsheet

---

# Response Format

Every API response must use the following format.

Success

{
    "success": true,
    "message": "",
    "data": {}
}

Error

{
    "success": false,
    "message": "",
    "errors": []
}

---

# API Principles

- Stateless
- JSON Response
- Input Validation
- Error Handling
- Authentication Required
- Role Authorization

---

# Planned Controllers

DashboardController

TransactionController

BudgetController

GoalController

AssetController

LiabilityController

SubscriptionController

RecurringBillController

ReportController

SettingsController

NotificationController

---

# Planned Services

DashboardService

TransactionService

BudgetService

GoalService

AssetService

LiabilityService

SubscriptionService

ReportService

SettingsService

---

# Repository Layer

SpreadsheetRepository

MemberRepository

TransactionRepository

BudgetRepository

GoalRepository

AssetRepository

LiabilityRepository

---

# Error Handling

Every exception must be handled in the Controller Layer.

Services should throw exceptions only.

Repositories should never generate user messages.

---

# Authentication

Google Account

Session Validation

Role Validation

Permission Validation

---

# Future API

REST API

Webhook

External Integration