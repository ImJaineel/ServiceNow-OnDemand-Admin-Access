/**
 * @file Catalog Client Scripts — Form Validations
 * @description CatalogClientScript bindings for date validation on the Request Admin Access item.
 * Both scripts are onChange type, referencing external JS files in src/client/ via Now.include().
 *
 * - validateStartDateClientScript: Validates start date >= now + 30 minutes
 * - validateEndDateClientScript: Validates end > start, min 30-min gap, max 5-day duration
 *
 * variableName properties reference the sys_id of the target catalog variable on the instance.
 *
 * @module catalog/client-scripts/catalog-scripts
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

import { CatalogClientScript } from '@servicenow/sdk/core'
import { requestServicenowAdminAccess } from '../items/request-admin-access.now'

export const validateStartDateClientScript = CatalogClientScript({
    $id: Now.ID['client-script-validate-start-date'],
    name: 'start_date_and_time',
    script: Now.include('../../../client/validate-start-date.client.js'),
    type: 'onChange',
    catalogItem: requestServicenowAdminAccess,
    variableName: 'd20109f6833b1690827999c0deaad3dd',
    appliesOnRequestedItems: true,
    appliesOnCatalogTasks: true,
    vaSupported: true,
})

export const validateEndDateClientScript = CatalogClientScript({
    $id: Now.ID['client-script-validate-end-date'],
    name: 'end_date_and_time',
    script: Now.include('../../../client/validate-end-date.client.js'),
    type: 'onChange',
    catalogItem: requestServicenowAdminAccess,
    variableName: '0e31817a833b1690827999c0deaad368',
    appliesOnRequestedItems: true,
    appliesOnCatalogTasks: true,
    vaSupported: true,
})
