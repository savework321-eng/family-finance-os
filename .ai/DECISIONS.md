# PFOS Architecture Decisions (ADR)

Version: 1.0

This document records all permanent technical decisions.

These decisions are FINAL.

The AI must NEVER change them unless explicitly instructed by the CTO.

---

# ADR-001

Project Name

Family Finance OS (PFOS)

Status

FINAL

---

# ADR-002

Programming Language

Google Apps Script (V8)

Status

FINAL

---

# ADR-003

Database

Google Spreadsheet

Spreadsheet ID

1rMTy8cjhhyqJRRrDTqQJkda2fAa-qLOHQJjyZ2z7N4M

Status

FINAL

---

# ADR-004

Accounting Method

Single Entry

Status

FINAL

---

# ADR-005

Architecture

Clean Architecture

Presentation

↓

Controller

↓

Service

↓

Repository

↓

Spreadsheet

Status

FINAL

---

# ADR-006

Repository Pattern

All database access must go through Repository Layer.

Status

FINAL

---

# ADR-007

Configuration

No hardcoded values.

All configuration must come from Configuration Layer.

Status

FINAL

---

# ADR-008

Namespace

PFOS

Only one global namespace is allowed.

Status

FINAL

---

# ADR-009

Coding Principles

SOLID

DRY

KISS

Status

FINAL

---

# ADR-010

Maximum File Size

500 lines

Recommended

350 lines

Status

FINAL

---

# ADR-011

Documentation

Every public method must contain JSDoc.

Status

FINAL

---

# ADR-012

Repository

GitHub is the single source of truth.

Status

FINAL

---

# ADR-013

Development Workflow

ChatGPT

↓

Architecture

↓

Gemini

↓

Implementation

↓

ChatGPT

↓

Review

↓

Git Commit

Status

FINAL

---

# ADR-014

AI Rules

The AI may NEVER

- redesign architecture
- rename modules
- create additional files
- move folders
- refactor completed modules

without approval.

Status

FINAL

---

# ADR-015

Quality Gate

Every implementation must pass

REVIEW_CHECKLIST.md

before approval.

Status

FINAL

---

# ADR-016

Deployment

Development

↓

Review

↓

Git Commit

↓

GitHub

↓

clasp push

↓

Google Apps Script

Status

FINAL

---

# Future ADR

Add new ADRs below this line.

Never modify existing ADRs.

Only append new decisions.