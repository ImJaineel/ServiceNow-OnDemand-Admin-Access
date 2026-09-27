/**
 * @file Catalog UI Policy — Request Temporary Access Extension
 * @description Single UI policy for the Request Extension catalog item.
 * Locks the request_for field after initial user selection (same pattern as other items).
 *
 * @module catalog/ui-policies/request-extension
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

import { CatalogUiPolicy } from '@servicenow/sdk/core'
import { requestTemporaryAccessExtension } from '../items/request-temporary-access-extension.now'

export const policyExtensionRequestForReadOnly = CatalogUiPolicy({
    $id: Now.ID['policy-extension-request-for-read-only'],
    catalogItem: requestTemporaryAccessExtension,
    shortDescription: "Make 'request_for' read-only depending on 'request_for'",
    catalogCondition: 'bc0ba1ba833f5690827999c0deaad35dISNOTEMPTY^EQ',
    appliesOnTargetRecord: true,
    appliesOnCatalogTasks: true,
    appliesOnRequestedItems: true,
    actions: [
        {
            variableName: 'bc0ba1ba833f5690827999c0deaad35d',
            variable: 'request_for',
            readOnly: true,
        },
    ],
})
