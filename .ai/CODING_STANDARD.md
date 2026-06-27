# PFOS Coding Standard

Version: 1.0

---

# PURPOSE

This document defines the mandatory coding standards for the Family Finance OS (PFOS) project.

Every AI and every developer must follow these rules.

These rules are permanent.

---

# GENERAL PRINCIPLES

Always follow:

- SOLID
- DRY
- KISS
- Clean Architecture

Code must prioritize readability and maintainability.

---

# LANGUAGE

Google Apps Script (V8)

JavaScript ES2022

HTML5

CSS3

Bootstrap 5

Chart.js

---

# FILE SIZE

Maximum:
500 lines

Recommended:
300–350 lines

If a file becomes too large,
split responsibilities.

---

# NAMING

Use PascalCase for classes.

Example:

TransactionService

SpreadsheetManager

BudgetRepository

ValidationException

---

Functions

camelCase

Example

getTransaction()

saveBudget()

validateSchema()

---

Constants

UPPER_SNAKE_CASE

Example

MAX_RETRY

DEFAULT_TIMEZONE

CACHE_DURATION

---

Namespaces

Use ONLY

PFOS

Never create additional global namespaces.

---

# JSDOC

Every public function

must contain

- description
- parameters
- return type
- throws

---

# COMMENTS

Explain WHY.

Do not explain obvious code.

Bad

// increment i

Good

// Prevent duplicated IDs during concurrent requests.

---

# CONFIGURATION

Never hardcode

Spreadsheet ID

Sheet names

Status values

Roles

Transaction Types

Currency

Date format

Timezone

Use Configuration Layer.

---

# EXCEPTIONS

Never throw

Error

Always throw

PFOSException

or derived exception.

---

# LOGGING

Never use

Logger.log()

outside Logging Layer.

---

# DATABASE

Never access SpreadsheetApp

outside Database Layer.

Always use

SpreadsheetManager

SheetManager

MetadataManager

---

# TESTABILITY

Code must be testable.

Avoid hidden dependencies.

Prefer dependency injection.

---

# FORBIDDEN

TODO

FIXME

temporary code

placeholder

demo code

mock implementation

unused variables

magic strings

duplicated code

dead code

---

# OUTPUT QUALITY

Every implementation must be production ready.

No exceptions.