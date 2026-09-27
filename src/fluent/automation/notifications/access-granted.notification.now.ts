/**
 * @file Access Granted Email Notification
 * @description Outbound email notification dispatched when temporary admin access is activated.
 * Alerts the requesting user, their manager, and the catalog item owner.
 * @module automation/notifications
 * @scope x_1297430_sncadmin
 * @sdk 4.12.2
 */

import { EmailNotification } from '@servicenow/sdk/core'

/**
 * Email notification definition for granted temporary admin access.
 * Triggered programmatically via Flow Designer when roles are actively provisioned.
 */
export const accessGrantedNotification = EmailNotification({
    // ─── Notification Configuration ───
    $id: Now.ID['notification-access-granted'],
    table: 'x_1297430_sncadmin_temporary_access',
    name: 'Access Granted',
    category: 'c97d83137f4432005f58108c3ffa917a',

    // ─── Trigger Conditions ───
    // Triggered programmatically by flow (via event.parm1) rather than directly on table insert/update
    triggerConditions: {
        generationType: 'triggered',
        item: 'event.parm1',
    },

    // ─── Recipient Details ───
    // Multi-stakeholder delivery: catalog item owner, target user, and user's direct manager
    recipientDetails: {
        // Specific user recipient (catalog item owner / administrator)
        recipientUsers: ['6816f79cc0a8016401c5a33be04be441'],
        // Dynamic reference fields on the record: requesting user and user's manager
        recipientFields: ['user', 'user.manager'],
        excludeDelegates: false,
        isSubscribableByAllUsers: false,
        sendToCreator: true,
    },

    // ─── Email Content & Template ───
    // Uses ServiceNow standard email template with ${field} token substitution
    emailContent: {
        // HTML body substituting user.name and temporary access record number
        messageHtml: '<p>Access Granted to User Name: ${user.name} for Number: ${number}.</p>',
        // References standard ServiceNow email template for unified styling
        template: '7ed0481f3b0b2200c869c2c703efc487',
        // Email subject line with ${number} substitution
        subject: 'Access Granted for Number: ${number}',
        includeAttachments: false,
        omitWatermark: false,
        pushMessageOnly: false,
        forceDelivery: false,
    },
})
