# Multaqa — Workspace Booking Web Application

> **Your Seat. Secured.**

Multaqa is a seat and room booking web application for coworking 
spaces, built as part of a Product Management project. The platform 
enables remote workers, freelancers, and students in Palestine to browse 
available desks and rooms, book them in advance, and manage their 
reservations — across two locations in Nablus and Ramallah.

---

## About This Project

This repository contains a functional prototype of Multaqa, developed to 
demonstrate and validate the core product experience defined in the 
Product Requirements Document (PRD).

This is a **Product Management project**. The prototype was built to:
- Validate the core booking user flow with real interactions
- Support stakeholder presentations and panel reviews
- Demonstrate the product vision in a clickable, working format

The product was scoped, researched, and defined by ME as a Product Manager. 
The prototype was built using AI-assisted development tool (Lovable) 
to accelerate delivery.

---

## Core Problem

Remote workers and freelancers in Palestine lack a reliable digital way to 
browse and book available desks or rooms within coworking spaces, leading 
to reliance on walk-ins and phone calls, and the risk of arriving to a 
full space.

---

## What the Prototype Covers

The prototype demonstrates the following core flows:

### User Flows
- **Seat Browsing** — browse available desks with photos, type, zone, 
  amenities, WiFi speed, and pricing
- **Room Browsing** — browse available rooms with capacity, equipment, 
  and pricing
- **Booking Flow** — 3-step flow: select date and time → review price 
  summary → confirm booking
- **Booking Confirmation** — on-screen confirmation with booking 
  reference number
- **My Reservations** — view, modify, and cancel bookings 
  (registered users)
- **Who's in the Space Today** — opt-in daily board with 
  anonymous toggle
- **Real-Time Occupancy Counter** — live seat count on homepage

### Admin Flows
- **Admin Dashboard** — view and manage all bookings
- **Unpaid Cash Bookings** — track and mark cash payments
- **Seat Management** — block seats, manage availability
- **Role-Based Access** — admin-only room visibility

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Regular User | user@test.ps | User1234 |
| Admin | admin@multaqa.ps | Admin1234 |

---

## Design System

| Token | Value |
|---|---|
| Primary / CTA | `#FF5100` |
| Navy / Dark | `#001279` |
| Body Text | `#535060` |
| Background | `#FFFFFF` |
| Font | Inter |

---

## Product Deliverables

This prototype is one part of a full Product Management deliverable set. 
The complete project includes:

- [x] Problem Statement
- [x] User Research Report (n=85 survey + 3 qualitative interviews)
- [x] Competitive Analysis Report
- [x] User Personas
- [x] Product Vision & Vision Statement
- [x] Prioritized Feature Backlog (MoSCoW — 35 features)
- [x] User Stories & Acceptance Criteria
- [x] OKRs & Success Metrics / KPIs
- [x] Product Roadmap (Now · Next · Later)
- [x] Sprint Plan
- [x] Prototype
- [x] PRD (Product Requirements Document)

---

## Key Product Decisions

**Cash-first payment model**  
Payment infrastructure in Palestine is complex. Cash on-site within 
3 days was chosen as the MVP payment method. Online card payment 
is planned for Phase 2 once a gateway partner is confirmed.

**Card list view before interactive floor plan**  
The card list validates the booking behavior at lower build cost. 
The interactive floor plan ships in Phase 2 once product-market 
fit is confirmed.

**Nablus as first-mover market**  
Nablus has zero direct digital booking competition. Multaqa enters 
as the first structured digital booking experience in the city.

---

## Disclaimer

This is a prototype built for a Product Management project. It uses 
mock data and simulated interactions. No real bookings, payments, or
emails are processed. All placeholder names, prices, and locations 
are fictional assumptions made to ground the product in a realistic context.

## Product Link (Using Replit)
 https://mult-link-proto--multaqa.replit.app/
 
---

*Prepared by Raghad Sharaf — Product Management Project, May 2026*
