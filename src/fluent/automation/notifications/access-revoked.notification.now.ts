/**
 * @file Access Revoked Email Notification
 * @description Outbound email notification sent when temporary admin access is revoked at the end of the access window.
 * Alerts the user, their manager, and the catalog item owner that roles have been removed.
 * @module automation/notifications
 * @scope x_1297430_sncadmin
 * @sdk 4.12.2
 */

import { EmailNotification } from '@servicenow/sdk/core'

/**
 * Email notification definition for revoked temporary admin access.
 * Triggered programmatically via Flow Designer after temporary roles are deleted.
 */
export const accessRevokedNotification = EmailNotification({
    // ─── Notification Configuration ───
    $id: Now.ID['notification-access-revoked'],
    table: 'x_1297430_sncadmin_temporary_access',
    name: 'Access Revoked',
    category: 'c97d83137f4432005f58108c3ffa917a',

    // ─── Trigger Conditions ───
    // Triggered programmatically by Flow Designer (via event.parm1) when the access duration expires
    triggerConditions: {
        generationType: 'triggered',
        item: 'event.parm1',
    },

    // ─── Recipient Details ───
    // Same recipient pattern as granted notification: owner, user, and user manager
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
    // Sent at the end of the access window when roles are removed
    emailContent: {
        // HTML body substituting user.name and temporary access record number
        messageHtml: '<p>Access revoked of User Name: ${user.name} for Number: ${number}.</p>',
        // References standard ServiceNow email template for unified styling
        template: '7ed0481f3b0b2200c869c2c703efc487',
        // Email subject line with ${number} substitution
        subject: 'Access Revoked for Number: ${number}',
        includeAttachments: false,
        omitWatermark: false,
        pushMessageOnly: false,
        forceDelivery: false,
    },
})
