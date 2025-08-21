# Roadmap

## v1.0.0 – eCommerce platform with multi-channel support & self-hosting guide

## Core

- [x] Product Management
- [x] Inventory Management
- [ ] Improve Checkout Flow
- [ ] Improve Cart Management
- [ ] Order History / Tracking
- [ ] Omni-Channel Functionality
- [ ] Shipping Management

## Plugins

- [x] Stripe Payment
- [x] CJ Dropshipping
- [ ] Shippo Fulfillment
- [ ] PayPal Payment
- [ ] Mollie Payment
- [ ] Shopify Source Integration
- [ ] Brightpearl Integration

## Channels

- [ ] Botpress Channel
- [ ] Facebook Channel

## Storefronts

- [x] Custom Storefront
- [x] Builder.io Storefront
- [ ] Plasmic Storefront

## Documentation

- [ ] Self-Hosting Quick Start
- [ ] Plugin Development
- [ ] Storefront Integration
- [ ] Authentication
- [ ] Multi-Tenancy Guide

Phase-by-Phase CMS Refactoring Plan

Phase 1: Infrastructure & Security Foundation

Duration: 1-2 weeks
Goal: Establish robust logging, security, and core infrastructure

1.1 Centralized Logging System

- Create src/core/logging/ module with structured logging
- Implement request/response middleware logging
- Add audit trails for sensitive operations (payments, user actions)
- Create log correlation IDs for request tracking

    1.2 Enhanced Security Layer

- Strengthen rate limiting with Redis-backed storage
- Implement input validation middleware
- Add security headers middleware
- Create secure credential management utilities
- Enhance RBAC with granular permissions

    1.3 Configuration Management

- Create src/core/config/ for environment-specific configs
- Add configuration validation on startup
- Implement feature flags system

---

Phase 2: Core Architecture Restructuring

Duration: 2-3 weeks
Goal: Establish clean service layer and separation of concerns

2.1 Service Layer Creation

- Create src/services/ directory with domain services:
    - PaymentService (Stripe operations)
    - OrderService (order lifecycle management)
    - CartService (cart operations)
    - EmailService (campaign & notification emails)
    - MediaService (file handling)

    2.2 Repository Pattern Implementation

- Create src/repositories/ for data access abstraction
- Implement common interfaces for CRUD operations
- Add query builders for complex operations

    2.3 Error Handling Standardization

- Create src/core/errors/ with custom error classes
- Implement global error handler
- Add consistent error response formatting

---

Phase 3: Collection & Hook Refactoring

Duration: 2-3 weeks
Goal: Simplify collections and extract business logic

3.1 Collection Simplification

- Extract complex validation logic to services
- Standardize collection configurations
- Create reusable field definitions
- Implement consistent access patterns

    3.2 Hook Optimization

- Move business logic from hooks to services
- Create hook utilities for common operations
- Implement async job processing for heavy operations
- Add comprehensive hook testing

    3.3 API Endpoint Restructuring

- Create src/api/ with versioned endpoints
- Implement request/response DTOs
- Add OpenAPI documentation
- Create consistent API response formats

---

Phase 4: Plugin Architecture Enhancement

Duration: 1-2 weeks
Goal: Make plugins more modular and configurable

4.1 Plugin Configuration

- Create plugin factory functions
- Add plugin health checks
- Implement plugin lifecycle management
- Create plugin configuration validation

    4.2 Custom Plugin Development

- Extract common plugin utilities
- Create plugin development guidelines
- Add plugin testing framework

---

Phase 5: Performance & Monitoring

Duration: 1-2 weeks
Goal: Add comprehensive monitoring and optimize performance

5.1 Performance Monitoring

- Add performance metrics collection
- Implement database query monitoring
- Create performance dashboards
- Add memory and CPU monitoring

    5.2 Caching Layer

- Implement Redis caching for frequently accessed data
- Add cache invalidation strategies
- Create cache warming for critical data

    5.3 Database Optimization

- Optimize database queries
- Add proper indexing strategies
- Implement database migration versioning

---

Phase 6: Testing & Documentation

Duration: 1-2 weeks
Goal: Ensure code quality and maintainability

6.1 Testing Infrastructure

- Add comprehensive unit tests
- Implement integration tests
- Create end-to-end test scenarios
- Add test data factories

    6.2 Documentation

- Create API documentation
- Add code documentation standards
- Create developer onboarding guides
- Document deployment procedures

---

Proposed New Directory Structure

src/
├── core/ # Core infrastructure
│ ├── config/ # Configuration management
│ ├── logging/ # Centralized logging
│ ├── security/ # Security utilities
│ ├── errors/ # Error handling
│ └── middleware/ # Common middleware
├── services/ # Business logic services
│ ├── PaymentService.ts
│ ├── OrderService.ts
│ ├── CartService.ts
│ └── EmailService.ts
├── repositories/ # Data access layer
├── collections/ # Simplified Payload collections
├── api/ # API endpoints
│ ├── v1/
│ └── v2/
├── utils/ # Pure utility functions
├── types/ # TypeScript definitions
└── plugins/ # Enhanced plugin system

Key Benefits

1. Modularity: Clear separation of concerns with service layer
2. Security: Enhanced security with proper validation and rate limiting
3. Transparency: Comprehensive logging and monitoring
4. Robustness: Error handling, testing, and performance monitoring
5. Maintainability: Clean architecture with proper documentation
