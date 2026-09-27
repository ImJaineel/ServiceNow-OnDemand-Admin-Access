# ServiceNow On-Demand Admin Access

> **Pure Now SDK Application** — Secure, temporary administrative access management for ServiceNow.

A custom-scoped ServiceNow application built entirely with **Now SDK 4.12.2** (Fluent TypeScript). It enables organizations to grant, track, and automatically revoke temporary admin access through a self-service catalog experience with full audit trails.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Components](#components)
  - [Data Model](#data-model)
  - [Service Catalog](#service-catalog)
  - [Automation (Flows & Actions)](#automation-flows--actions)
  - [Notifications](#notifications)
  - [UI Configuration](#ui-configuration)
  - [Security & Access Control](#security--access-control)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Temporary Admin Access** — Grant admin roles for a defined time window with automatic revocation.
- **Fine-Grained & Coarse-Grained Access** — Choose specific `*_admin` roles or full `admin`/`security_admin`.
- **Automated Lifecycle** — Flow Designer manages the complete grant → wait → revoke lifecycle.
- **Session Termination** — Forces re-authentication after role changes to prevent stale privilege escalation.
- **Approval Workflows** — Configurable approval routing before access is granted or revoked.
- **Email Notifications** — Automatic alerts on access grant and revocation.
- **Audit Trail** — Activity stream on every Temporary Access record with timestamped comments.
- **Self-Contained** — No external update sets, no global-scope dependencies. All cross-scope privileges packaged natively.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Service Catalog (Portal)                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐ │
│  │ Request Admin   │  │ Revoke Admin     │  │ Request Extension  │ │
│  │ Access          │  │ Access           │  │                    │ │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬───────────┘ │
│           │                    │                      │             │
│  ┌────────▼────────────────────▼──────────────────────▼───────────┐ │
│  │         Order Guide: Admin Access Management                  │ │
│  └───────────────────────────┬───────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │   Flow Designer (Automation)     │
              │                                  │
              │  ┌────────────────────────────┐  │
              │  │ Request Admin Access Flow  │  │
              │  │ (approval + variable proc) │  │
              │  └────────────┬───────────────┘  │
              │               │ creates          │
              │  ┌────────────▼───────────────┐  │
              │  │ Temporary Access Record    │  │
              │  └────────────┬───────────────┘  │
              │               │ triggers         │
              │  ┌────────────▼───────────────┐  │
              │  │ Temp Admin Access Mgmt     │  │
              │  │ Flow (lifecycle)           │  │
              │  │                            │  │
              │  │ Wait Start → Grant Roles   │  │
              │  │ → Notify → Wait End →     │  │
              │  │ Revoke Roles → Notify →   │  │
              │  │ Terminate Sessions         │  │
              │  └────────────────────────────┘  │
              │                                  │
              │  ┌────────────────────────────┐  │
              │  │ Revoke Admin Access Flow   │  │
              │  │ (approval routing)         │  │
              │  └────────────────────────────┘  │
              └──────────────────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │   Temporary Access Table         │
              │   x_1297430_sncadmin_            │
              │   temporary_access               │
              │                                  │
              │   Tracks: user, roles, dates,    │
              │   granted status, audit trail    │
              └──────────────────────────────────┘
```

---

## Prerequisites

| Requirement         | Version / Details                       |
| ------------------- | --------------------------------------- |
| **Node.js**         | 18.x or later                           |
| **Now SDK**         | 4.12.2 (installed as devDependency)     |
| **ServiceNow**      | Vancouver or later (tested on Yokohama) |
| **Instance Access** | Admin credentials with `now-sdk` auth   |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ImJaineel/On-Demand-Admin-Access.git
cd On-Demand-Admin-Access

# 2. Install dependencies
npm install

# 3. Authenticate with your ServiceNow instance
npx now-sdk login --auth <profile-name>

# 4. Build & validate (0 errors expected)
npm run build

# 5. Deploy to instance
npm run deploy
# Or with a specific auth profile:
npx now-sdk install --auth <profile-name>
```

> [!IMPORTANT]
> After deployment, verify all 4 flows are **activated** in Flow Designer on your instance.

### Optional Post-Deployment Steps

- Set `com.snc.process_flow.reporting.level` to `FULL` to enable flow execution reporting.
- Verify the Service Catalog entry appears under the configured catalog/category.

---

## Project Structure

```
On-Demand-Admin-Access/
├── now.config.json                          # SDK app config (scope, name, IDs)
├── package.json                             # Dependencies & npm scripts
├── tsconfig.json                            # Root TypeScript config
│
├── src/
│   ├── client/                              # Client-side scripts (browser)
│   │   ├── validate-start-date.client.js    #   Start date ≥ now+30min validation
│   │   ├── validate-end-date.client.js      #   End date validation (range + max 5 days)
│   │   └── tsconfig.json                    #   Client TS config
│   │
│   ├── server/                              # Server-side scripts (instance)
│   │   ├── snc_admin_access_catalog_client_callable.server.js
│   │   │                                    #   GlideAjax: role lookup utilities
│   │   └── terminate_users_session.server.js #   Session lockout script
│   │
│   └── fluent/                              # Now SDK Fluent TypeScript definitions
│       ├── temporary_access.now.ts          #   Table schema (core data model)
│       ├── roles.now.ts                     #   Application roles
│       ├── acls.now.ts                      #   Access control lists (CRUD)
│       ├── navigation.now.ts                #   App menu & module
│       ├── privileges.now.ts                #   Cross-scope privileges (8 total)
│       ├── properties.now.ts                #   System properties (role IDs, activity)
│       ├── script_includes.now.ts           #   Client-callable script include
│       ├── tsconfig.json                    #   Fluent TS config
│       │
│       ├── catalog/                         # ── Service Catalog ──
│       │   ├── items/
│       │   │   ├── request-admin-access.now.ts        # Request admin access item
│       │   │   ├── revoke-admin-access.now.ts         # Revoke admin access item
│       │   │   └── request-temporary-access-extension.now.ts  # Extension item
│       │   ├── order-guides/
│       │   │   └── admin-access-management.now.ts     # Order guide (3 items)
│       │   ├── ui-policies/
│       │   │   ├── request-admin-access.ui-policy.now.ts  # 6 policies
│       │   │   ├── revoke-admin-access.ui-policy.now.ts   # 4 policies
│       │   │   └── request-extension.ui-policy.now.ts     # 1 policy
│       │   └── client-scripts/
│       │       └── catalog-scripts.now.ts             # 2 onChange scripts
│       │
│       ├── automation/                      # ── Flow Designer ──
│       │   ├── flows/
│       │   │   ├── temporary-admin-access-management.now.ts  # Lifecycle flow (★)
│       │   │   ├── revoke-servicenow-admin-access.now.ts     # Revocation flow
│       │   │   └── request-servicenow-admin-access.flow.now.ts # Request flow (Record)
│       │   ├── actions/
│       │   │   └── terminate-user-session.action.now.ts      # Session termination
│       │   └── notifications/
│       │       ├── access-granted.notification.now.ts        # Grant email
│       │       └── access-revoked.notification.now.ts        # Revoke email
│       │
│       ├── ui/                              # ── User Interface ──
│       │   ├── temporary-access.form.now.ts # Form layout (2-col + activity)
│       │   └── temporary-access.list.now.ts # List view columns
│       │
│       └── generated/                       # ── Auto-generated ──
│           └── keys.ts                      # Now.ID key registry (DO NOT EDIT)
```

---

## Components

### Data Model

**Table: `x_1297430_sncadmin_temporary_access`** — Tracks each temporary access grant.

| Column             | Type          | Description                                    |
| ------------------ | ------------- | ---------------------------------------------- |
| `number`           | String        | Auto-numbered (`TEMP_ADMIN_0001000+`)          |
| `user`             | Reference     | Target user (`sys_user`)                        |
| `request_ticket`   | Reference     | Source request (`task` — supports REQ/RITM)     |
| `access_granted`   | List          | Roles granted (`sys_user_role`, multi-value)    |
| `start_date`       | DateTime      | Access window start                             |
| `end_date`         | DateTime      | Access window end                               |
| `granted`          | Boolean       | Whether access is currently active              |
| `additional_comment` | Journal     | Activity stream for audit trail                |

### Service Catalog

#### Catalog Items (3)

| Item | Purpose | Fulfillment |
| ---- | ------- | ----------- |
| **Request ServiceNow Admin Access** | Request temporary or permanent admin roles | Flow: Request Admin Access |
| **Revoke ServiceNow Admin Access** | Revoke previously granted admin roles | Flow: Revoke Admin Access |
| **Request Temporary Access Extension** | Extend an existing temporary access window | Standard Execution Plan |

#### Order Guide

**ServiceNow Admin Access Management** — Unified wizard that routes users to the appropriate catalog item based on their selection (Request / Revoke / Extend).

#### UI Policies (11 total)

Declarative field visibility and validation rules that dynamically show/hide/require fields based on user selections:

- **Request Item**: 6 policies (date fields, role picker, security_admin toggle, request_for lock)
- **Revoke Item**: 4 policies (RITM reference, role picker, access type, request_for lock)
- **Extension Item**: 1 policy (request_for lock)

#### Client Scripts (2)

- **Start Date Validation** — Ensures start date is ≥ 30 minutes from now.
- **End Date Validation** — Ensures end date is after start, ≥ 30min gap, ≤ 5-day maximum duration.

### Automation (Flows & Actions)

#### Flows (3)

| Flow | Trigger | Purpose |
| ---- | ------- | ------- |
| **Temporary Admin Access Management** ★ | Record created on Temporary Access table | Full lifecycle: wait → grant → notify → wait → revoke → notify → complete |
| **Request ServiceNow Admin Access** | Service Catalog submission | Processes catalog variables, routes approval, creates Temporary Access record |
| **Revoke ServiceNow Admin Access** | Service Catalog submission | Extracts catalog variables, routes approval to item owner |

#### Actions (1)

| Action | Purpose |
| ------ | ------- |
| **Terminate User's Session** | Calls `GlideSessions.lockOutSessionsInAllNodes()` to force re-authentication after role changes |

### Notifications

| Notification | When | Recipients |
| ------------ | ---- | ---------- |
| **Access Granted** | After roles are assigned | User + Manager + Item Owner |
| **Access Revoked** | After roles are removed | User + Manager + Item Owner |

### UI Configuration

- **Form**: Two-column layout with number/user, granted/request_ticket, access roles, dates, and activity stream.
- **List**: All key operational and audit columns in default view.

### Security & Access Control

#### Role
- `x_1297430_sncadmin.user` — Required for all table operations and navigation.

#### ACLs (4)
- Create, Read, Write: Active, requiring `user` role.
- Delete: **Inactive** by default (records preserved for audit compliance).

#### Cross-Scope Privileges (8)

| Target | Operations | Why |
| ------ | ---------- | --- |
| `sys_user_session` | Read, Delete | Terminate user sessions |
| `sys_user_has_role` | Read, Create, Delete | Grant and revoke roles |
| `sys_user_role` | Read | Resolve role references |
| `sc_req_item` | Write | Update catalog request items |
| `Glide API: properties` | Execute | Read system properties from scripts |

---

## Configuration

### Application Properties

| Property | Default | Purpose |
| -------- | ------- | ------- |
| `x_1297430_sncadmin.admin-role-sys_id` | `2831a114c611228501d4ea6c309d626d` | Platform `admin` role sys_id |
| `x_1297430_sncadmin.scurity_admin-role-sys_id` | `b2d8f7130a0a0baa5bf52498ecaadeb4` | Platform `security_admin` role sys_id |

> [!NOTE]
> These sys_ids are standard across all ServiceNow instances. Only change if your instance has non-standard role records.

### Application Identity

| Key | Value |
| --- | ----- |
| **Scope** | `x_1297430_sncadmin` |
| **Application ID** | `7c45a198c3451610895098fdd4013159` |
| **SDK Version** | `4.12.2` |

---

## Development Workflow

### Build

```bash
npm run build          # Validates all fluent definitions
```

A clean build produces **0 errors**. One expected warning:

- **TS11**: Property name `glide.ui.x_1297430_sncadmin_temporary_access_activity.fields` doesn't start with the app scope prefix. This is correct — it's the required naming convention for the activity formatter.

### Key Concepts

- **`Now.ID['key']`** — All records use descriptive alias keys (e.g., `Now.ID['catalog-item-request-admin-access']`). Keys are registered in `src/fluent/generated/keys.ts` (auto-managed, never edit manually).
- **`Now.include()`** — References external JS scripts from fluent definitions.
- **First-class DSL** — Used wherever available (`CatalogItem`, `Flow`, `Action`, `EmailNotification`, `Form`, `List`, `CatalogUiPolicy`, `CatalogClientScript`, etc.).
- **`Record()` fallback** — Used only for entities without SDK DSL support: `OrderGuide` (`sc_cat_item_guide`), `sys_app_module`, `sys_embedded_help_role`.

### Scripts

| Location | Language | Runtime |
| -------- | -------- | ------- |
| `src/client/*.js` | JavaScript | Browser (ServiceNow form) |
| `src/server/*.js` | JavaScript | Server (GlideRecord/GlideSessions) |
| `src/fluent/*.now.ts` | TypeScript | Build-time (compiled by Now SDK) |

---

## Deployment

```bash
# Deploy to a specific instance profile
npx now-sdk install --auth <profile-name>

# Or use the npm script (uses default auth)
npm run deploy
```

### Post-Deployment Checklist

1. ✅ Verify all 4 flows are **Activated** in Flow Designer.
2. ✅ Verify the Order Guide appears in the Service Catalog.
3. ✅ Verify the `user` role is assigned to appropriate users/groups.
4. ✅ Test the end-to-end flow: Request → Approve → Grant → Wait → Revoke.
5. ✅ (Optional) Set `com.snc.process_flow.reporting.level` = `FULL` for flow reporting.

---

## License

This project is licensed under the terms described in the [LICENSE](LICENSE) file.

## Author

Created by [Jaineel Petiwale](https://github.com/ImJaineel).
