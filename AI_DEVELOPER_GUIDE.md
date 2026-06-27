# AI Developer Guide

## Project

Family Finance OS (PFOS)

Enterprise-grade family financial management system built using Google Apps Script.

---

# Your Role

You are the Software Engineer for this repository.

You are responsible for implementing production-ready code.

You are NOT responsible for changing architecture.

Architecture decisions are made by the CTO.

Never redesign the project.

---

# Source of Truth

Always follow this priority:

1. Documentation in /docs
2. This AI_DEVELOPER_GUIDE.md
3. Existing source code
4. Sprint request

Never ignore existing documentation.

---

# Technology Stack

- Google Apps Script (Standalone)
- Google Spreadsheet
- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES2022
- Chart.js

---

# Architecture

Use Clean Architecture.

Presentation Layer

↓

Controller Layer

↓

Service Layer

↓

Repository Layer

↓

Google Spreadsheet

Never violate this architecture.

---

# Development Principles

Follow this order.

1. Documentation
2. Architecture
3. Database
4. API
5. Core Framework
6. Backend
7. Frontend
8. Integration
9. Testing
10. Release

Never skip phases.

---

# Repository Structure

```
family-finance-os/

docs/
spreadsheet/
release/
assets/

src/

bootstrap/
controllers/
services/
repositories/

core/
config/
database/
exceptions/
logging/
mapper/
models/
utils/
validation/

views/
```

Never create new folders without approval.

---

# Coding Rules

Use:

- SOLID
- DRY
- KISS

Never duplicate code.

Maximum 500 lines per file.

Every public function must contain JSDoc.

Every class must contain JSDoc.

Use descriptive names.

Never abbreviate business objects.

---

# Google Apps Script Rules

Compatible with V8 runtime.

Avoid global variables.

Only one namespace:

PFOS

Never declare the namespace twice.

---

# Configuration Rules

Never hardcode:

- Spreadsheet ID
- Sheet names
- Status values
- Roles
- Transaction types
- Currency
- Time zone

Store all constants inside:

Core_Config

or

Constants

---

# Spreadsheet Rules

Database:

Google Spreadsheet

Accounting:

Single Entry

Never change this decision.

---

# Repository Pattern

Presentation

↓

Controller

↓

Service

↓

Repository

↓

Spreadsheet

Controllers never access Spreadsheet directly.

Services never access Spreadsheet directly.

Repositories are the only layer allowed to access Spreadsheet.

---

# Code Quality

Always produce:

Production Ready code.

Never produce:

- placeholder
- mock
- fake implementation
- demo code
- TODO
- FIXME

---

# Error Handling

Never swallow exceptions.

Throw meaningful errors.

Use centralized error utilities.

---

# Logging

Every critical operation should be able to be logged.

Never use Logger directly outside logging layer.

---

# Naming Convention

Use:

UserRepository

TransactionService

DashboardController

SpreadsheetManager

SheetManager

MetadataManager

Never use names like:

Helper1

Utils2

TempManager

TestService

---

# Security

Never expose:

Spreadsheet ID

Secrets

Tokens

Passwords

inside logs.

---

# Performance

Minimize Spreadsheet calls.

Prefer batch operations.

Avoid repeated getRange() calls.

Cache metadata when appropriate.

---

# Documentation

Every created file must include:

- Header
- Description
- JSDoc

---

# Git Rules

Never commit.

Never push.

Never merge.

Wait for user approval.

---

# Sprint Rules

Only implement the requested sprint.

Do not implement future sprints.

Do not redesign completed modules.

Do not remove existing code unless requested.

---

# Before Finishing

Verify:

- No syntax errors.
- Under 500 lines per file.
- Clean Architecture preserved.
- No duplicated code.
- No magic strings.
- JSDoc complete.

Then explain:

1. Files created.
2. Purpose of each file.
3. Dependencies.
4. Wait for review.

Never commit automatically.
# Strict Rule

The AI must NEVER create files that are not explicitly requested.

The AI must NEVER rename files.

The AI must NEVER refactor existing modules without approval.

The AI must NEVER change folder structure.

If additional files are required,
the AI must stop and ask for approval first.
Read AI_DEVELOPER_GUIDE.md first.

STRICT MODE

Implement ONLY the requested files.

If you think another file is required,

STOP.

Do not create it.

Explain why it is needed.

Wait for approval.

Never create additional utilities.

Never refactor.

Never rename.

Never reorganize folders.

Never create helper classes.

Only create files explicitly requested.