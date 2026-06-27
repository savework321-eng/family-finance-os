# System Architecture

## Overview

Family Finance OS (PFOS) adopts a Clean Architecture approach to ensure the application remains maintainable, scalable, and easy to extend over time.

The application is divided into independent layers, each with a single responsibility.

---

# Technology Stack

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Chart.js

---

## Backend

- Google Apps Script (Standalone)

---

## Database

- Google Spreadsheet

---

## Authentication

- Google Account

---

# System Layers

The application consists of the following layers:

## Presentation Layer

Responsible for:

- User Interface
- User Interaction
- Input Validation
- Navigation

Technologies:

- HTML
- Bootstrap
- JavaScript

---

## Controller Layer

Responsible for:

- Receiving requests
- Validating requests
- Calling services
- Returning responses

Controllers never access the database directly.

---

## Service Layer

Responsible for:

- Business Logic
- Data Processing
- Validation
- Financial Calculations

Services never interact directly with the user interface.

---

## Repository Layer

Responsible for:

- Reading spreadsheet data
- Writing spreadsheet data
- Searching records
- Updating records

Repositories never contain business logic.

---

## Utility Layer

Responsible for:

- Date utilities
- Number formatting
- Currency formatting
- Helper functions
- Common reusable logic

---

## Configuration Layer

Responsible for:

- Constants
- Configuration values
- Sheet names
- Default settings

No magic strings are allowed outside this layer.

---

# Database Flow

Google Spreadsheet

↓

Repository Layer

↓

Service Layer

↓

Controller Layer

↓

Frontend

---

# Request Flow

User

↓

Frontend

↓

Controller

↓

Service

↓

Repository

↓

Google Spreadsheet

↓

Repository

↓

Service

↓

Controller

↓

Frontend

↓

User

---

# Folder Structure

src/

backend/

frontend/

shared/

tests/

---

# Design Principles

- Clean Architecture
- SOLID Principles
- DRY
- Separation of Concerns
- Modular Design
- Reusable Components

---

# Scalability

The architecture must support:

- New modules
- Additional family members
- New financial reports
- Future integrations
- Long-term maintenance

---

# Security Principles

- Authentication required
- Authorization based on role
- Server-side validation
- Audit logging
- Data integrity protection

---

# Performance Principles

- Minimize Spreadsheet access
- Reuse shared services
- Reduce duplicate processing
- Modular implementation