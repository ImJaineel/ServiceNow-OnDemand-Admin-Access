/**
 * @file Revoke ServiceNow Admin Access Flow
 * @description Catalog fulfillment flow for processing admin access revocation requests.
 * Extracts submitted catalog variables and routes approval to the catalog item owner.
 * Note: Handles approval routing; actual role removal is handled downstream post-approval.
 * @module automation/flows
 * @scope x_1297430_sncadmin
 * @sdk 4.12.2
 */

import { Flow, wfa, trigger, action } from '@servicenow/sdk/automation'

/**
 * Service Catalog fulfillment flow for Revoke ServiceNow Admin Access requests.
 * Evaluates submitted requests, retrieves form variables, and coordinates approvals.
 */
export const revokeServicenowAdminAccessFlow = Flow(
    // ─── Flow Configuration ───
    {
        $id: Now.ID['flow-revoke-servicenow-admin-access'],
        name: 'Revoke ServiceNow Admin Access',
        internalName: 'revoke_servicenow_admin_access',
        runAs: 'system',
        masterSnapshot: 'fc801ca883f466104cd2c900feaad30a',
    },
    // ─── Trigger Definition ───
    // Triggered upon submission of the Revoke Admin Access Service Catalog item
    wfa.trigger(
        trigger.application.serviceCatalog,
        {
            $id: Now.ID['trigger-revoke-service-catalog'],
        },
        {
            // Flow executes asynchronously in the background upon catalog submission
            run_flow_in: 'background',
        }
    ),
    // ─── Flow Steps ───
    (_params) => {
        // ─── Step 1: Extract Catalog Variables ───
        // Extracts submitted form question answers from the Requested Item (RITM)
        wfa.action(
            action.core.getCatalogVariables,
            {
                $id: Now.ID['flow-action-revoke-get-catalog-variables'],
                uuid: 'cc168c08-a436-4e37-ae05-9a7f7c4ac469',
            },
            {
                requested_item: wfa.dataPill(_params.trigger.request_item, 'reference'),
                // sys_id referencing the 'Revoke ServiceNow Admin Access' catalog item
                template_catalog_item: '1109e97283fb5690827999c0deaad38c',
                // Comma-separated list of variable sys_ids (item_option_new) to retrieve
                catalog_variables:
                    '4c2bad3e833f5690827999c0deaad3c7:item_option_new,109ab97283b39690827999c0deaad329:item_option_new,ad6b797283f39690827999c0deaad3cf:item_option_new,8e6db53683f39690827999c0deaad3ec:item_option_new',
            }
        )

        // ─── Step 2: Route Approval to Catalog Item Owner ───
        // Routes the approval request to the owner of the catalog item before proceeding
        wfa.action(
            action.core.askForApproval,
            {
                $id: Now.ID['flow-action-revoke-ask-approval'],
                uuid: '9a4a120a-ab3b-47ee-90bf-d20095948d88',
            },
            {
                record: wfa.dataPill(_params.trigger.request_item, 'reference'),
                table: 'sc_req_item',
                approval_reason: '',
                approval_field: 'approval',
                journal_field: 'approval_history',
                // Approval condition: requires approval from the catalog item owner
                approval_conditions: wfa.approvalRules({
                    conditionType: 'OR',
                    ruleSets: [
                        {
                            action: 'Approves',
                            conditionType: 'AND',
                            rules: [
                                [
                                    {
                                        ruleType: 'Any',
                                        // Dynamically targets the owner defined on the catalog item record
                                        users: [wfa.dataPill(_params.trigger.request_item.cat_item.owner, 'reference')],
                                        groups: [],
                                        manual: false,
                                    },
                                ],
                            ],
                        },
                    ],
                }),
                due_date: wfa.approvalDueDate({
                    action: 'none',
                    dateType: 'actual',
                    date: '{{}}',
                    duration: 1,
                    durationType: 'days',
                    daysSchedule: '',
                }),
            }
        )
    }
)
