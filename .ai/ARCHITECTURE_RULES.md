# Architecture Rules

Version 1.0

These rules are permanent.

---

# Clean Architecture

Presentation

↓

Controller

↓

Service

↓

Repository

↓

Google Spreadsheet

Never violate this architecture.

---

# Layer Responsibility

Presentation

UI only.

Controller

Receive requests.

Validate request.

Call services.

Service

Business logic.

Repository

Database access.

Spreadsheet

Persistence.

---

# Forbidden

Controller accessing Spreadsheet.

Service accessing Spreadsheet.

Presentation accessing Repository.

Business logic inside Repository.

Business logic inside Spreadsheet.

---

# Repository Pattern

Every module must use:

Controller

↓

Service

↓

Repository

Repositories are the only layer allowed to communicate with SpreadsheetManager.

---

# Dependency Rule

Dependencies always point inward.

Outer layers never own inner layers.

---

# Configuration

Never hardcode

- Spreadsheet ID
- Sheet Names
- Roles
- Status
- Currency
- Date Format
- Time Zone

Everything must come from Configuration Layer.

---

# File Size

Maximum

500 lines

Recommended

350 lines

---

# Namespace

Use only

PFOS

Never create additional global namespaces.

---

# Logging

Never call Logger directly.

Use Logging Layer.

---

# Exception

Never throw raw Error.

Use project exceptions.

---

# Database

Never access SpreadsheetApp directly outside Database Layer.

Always use

SpreadsheetManager

SheetManager

MetadataManager

---

# Future Migration

The architecture must support migration to

- PostgreSQL
- MySQL
- Firestore
- Supabase

without changing Services.