/**
 * @file temporary_access.now.ts
 * @description Table definition for the Temporary Access tracking table.
 * Captures lifecycle details of temporary role assignments, active duration,
 * approval tickets, and audit trail records.
 * @module temporary_access
 * @scope x_1297430_sncadmin
 * @sdk ServiceNow Now SDK 4.12.2
 */

import {
    Table,
    StringColumn,
    BooleanColumn,
    DateTimeColumn,
    ReferenceColumn,
    ListColumn,
    GenericColumn,
} from '@servicenow/sdk/core'

/**
 * Temporary Access tracking table (`x_1297430_sncadmin_temporary_access`).
 * Stores temporary administrative role grants and tracks approval links,
 * start/end validity windows, and audit comments.
 */
export const x_1297430_sncadmin_temporary_access = Table({
    name: 'x_1297430_sncadmin_temporary_access',
    label: 'Temporary Access',
    audit: true,
    display: 'number',
    schema: {
        number: StringColumn({
            label: 'Number',
            mandatory: true,
            readOnly: true,
            maxLength: 40,
            attributes: {
                ignore_filter_on_new: true,
            },
            default: 'javascript:global.getNextObjNumberPadded();',
        }),
        user: ReferenceColumn({
            label: 'User',
            mandatory: true,
            readOnly: true,
            referenceTable: 'sys_user',
        }),
        // References generic 'task' table to support multiple ticket types (REQ, RITM, etc.) without coupling to a specific table
        request_ticket: ReferenceColumn({
            label: 'Request Ticket',
            mandatory: true,
            readOnly: true,
            referenceTable: 'task',
        }),
        // ListColumn referencing sys_user_role allows storing multiple granted roles in a single access record
        access_granted: ListColumn({
            label: 'Access Granted',
            mandatory: true,
            readOnly: true,
            referenceTable: 'sys_user_role',
            maxLength: 1024,
        }),
        start_date: DateTimeColumn({
            label: 'Start Date',
            mandatory: true,
            readOnly: true,
        }),
        end_date: DateTimeColumn({
            label: 'End Date',
            mandatory: true,
            readOnly: true,
        }),
        granted: BooleanColumn({
            label: 'Granted',
            readOnly: true,
        }),
        additional_comment: GenericColumn({
            columnType: 'journal_input',
            label: 'Additional Comment',
            maxLength: 4000,
        }),
    },
    // ─── Auto-Numbering Configuration ───
    // Generates unique record numbers using TEMP_ADMIN_ prefix with 7 padded digits for audit and tracking
    autoNumber: {
        prefix: 'TEMP_ADMIN_',
        number: 1000,
        numberOfDigits: 7,
    },
    // ─── Table Indexes ───
    // Non-unique indexes on request_ticket and user optimize lookup performance during workflow execution and active-access queries
    index: [
        {
            name: 'index',
            unique: false,
            element: 'request_ticket',
        },
        {
            name: 'index2',
            unique: false,
            element: 'user',
        },
    ],
})
