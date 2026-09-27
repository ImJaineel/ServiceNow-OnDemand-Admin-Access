/**
 * @file Temporary Admin Access Management Flow
 * @description Core lifecycle flow for temporary admin access management.
 * Coordinates time-bounded privilege escalation, role provisioning, notification dispatch,
 * and automated role revocation with full audit logging.
 * @module automation/flows
 * @scope x_1297430_sncadmin
 * @sdk 4.12.2
 */

import { Flow, FlowStage, wfa, trigger, action } from '@servicenow/sdk/automation'

/**
 * Core lifecycle flow for temporary admin access management.
 * Orchestrates the end-to-end access lifecycle across sequential stages:
 * Awaiting Start → Granting → Granted → Awaiting End → Revoking → Revoked → Completed.
 */
export const temporaryAdminAccessManagementFlow = Flow(
    // ─── Flow Configuration & Stages ───
    {
        $id: Now.ID['flow-temporary-admin-access-management'],
        name: 'Temporary Admin Access Management',
        internalName: 'temporary_admin_access_management',
        runAs: 'system',
        masterSnapshot: '0abc3d1883f826104cd2c900feaad334',
        // Flow stage progression reflecting each milestone of the access lifecycle
        stages: {
            // Stage 1: Waiting until the requested start_date is reached
            awaitingStartTime: FlowStage({
                label: 'Awaiting Start Time',
                value: 'awaiting_start_time',
                alwaysShow: true,
            }),
            // Stage 2: Actively inserting role assignments in sys_user_has_role
            grantingAccess: FlowStage({
                label: 'Granting Access',
                value: 'granting_access',
                alwaysShow: true,
            }),
            // Stage 3: Roles successfully granted; access confirmation notification sent
            accessGranted: FlowStage({
                label: 'Access Granted',
                value: 'access_granted',
                alwaysShow: true,
            }),
            // Stage 4: Access is active; waiting until the requested end_date is reached
            awaitingEndTime: FlowStage({
                label: 'Awaiting End Time',
                value: 'awaiting_end_time',
                alwaysShow: true,
            }),
            // Stage 5: Actively querying and deleting role assignments from sys_user_has_role
            revokingAccess: FlowStage({
                label: 'Revoking Access',
                value: 'revoking_access',
                alwaysShow: true,
            }),
            // Stage 6: Roles successfully removed; revocation notification sent
            accessRevoked: FlowStage({
                label: 'Access Revoked',
                value: 'access_revoked',
                alwaysShow: true,
            }),
            // Stage 7: Entire lifecycle finished; audit record updated to completed
            completed: FlowStage({
                label: 'Completed',
                value: 'completed',
                alwaysShow: true,
            }),
        },
    },
    // ─── Flow Trigger Definition ───
    // Triggered automatically when a new record is inserted into the Temporary Access table
    wfa.trigger(
        trigger.record.created,
        {
            $id: Now.ID['trigger-temp-access-created'],
        },
        {
            table: 'x_1297430_sncadmin_temporary_access',
            condition: '^EQ',
            run_on_extended: 'false',
            run_flow_in: 'any',
            run_when_user_list: [],
            run_when_setting: 'both',
            run_when_user_setting: 'any',
        }
    ),
    (_params) => {
        // ─── Stage 1: Awaiting Start Time ───
        // Hold execution until the scheduled start date and time
        wfa.stage(_params.stages.awaitingStartTime)
        // Uses relative duration wait (1 second after start_date) to pause until the access window begins
        wfa.flowLogic.waitForADuration({
            $id: Now.ID['flow-logic-wait-start-time'],
            uuid: '4bf514bd-4f4b-46c1-872a-25dd5571a73e',
            durationType: 'relative_duration',
            duration: Duration({
                seconds: 1,
            }),
            relativeOperator: 'after',
            relativeDatetime: wfa.dataPill(_params.trigger.current.start_date, 'glide_date_time') as any,
        })

        // ─── Stage 2: Granting Access ───
        // Transition stage and log audit entry before role provisioning begins
        wfa.stage(_params.stages.grantingAccess)
        // Record audit activity comment that role assignment is in progress
        wfa.action(
            action.core.updateRecord,
            {
                $id: Now.ID['flow-action-starting-grant-comment'],
                uuid: 'a7063562-d703-4270-a07a-8e649cb2c156',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                values: TemplateValue({
                    additional_comment: 'Starting to Grant Access',
                }),
            }
        )
        wfa.stage(_params.stages.grantingAccess)
        // Iterate through each role listed in access_granted and provision via sys_user_has_role
        wfa.flowLogic.forEach(
            wfa.dataPill(_params.trigger.current.access_granted, 'glide_list'),
            {
                annotation: 'Grant all Access',
                $id: Now.ID['flow-logic-foreach-grant-role'],
            },
            (item_3) => {
                // Assign role to the requesting user in sys_user_has_role table
                wfa.action(
                    action.core.createRecord,
                    {
                        $id: Now.ID['flow-action-assign-user-role'],
                        uuid: 'b826fecd-1ba1-44fc-999c-2291aaf88ed8',
                    },
                    {
                        table_name: 'sys_user_has_role',
                        values: TemplateValue({
                            user: wfa.dataPill(_params.trigger.current.user, 'reference'),
                            role: wfa.dataPill(item_3, 'string'),
                        }),
                    }
                )
            }
        )

        // ─── Stage 3: Access Granted & Notification ───
        // Update record status to granted and log completion comment for the grant phase
        wfa.stage(_params.stages.accessGranted)
        wfa.action(
            action.core.updateRecord,
            {
                $id: Now.ID['flow-action-access-granted-update'],
                uuid: '30a967e0-acd5-444f-8f18-1e6f3d19060e',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                values: TemplateValue({
                    additional_comment: wfa.inlineScript(`return 'Access Granted';`),
                    granted: 'true',
                }),
            }
        )
        wfa.stage(_params.stages.accessGranted)
        // Dispatch 'Access Granted' notification alerting user and stakeholders that access is now live
        wfa.action(
            action.core.sendNotification,
            {
                $id: Now.ID['flow-action-send-access-granted-notification'],
                uuid: '2f5050c6-8e43-41d7-b496-52b96d1b7462',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                notification: 'e03f61d083b826104cd2c900feaad385',
            }
        )
        // ─── Stage 4: Awaiting End Time ───
        // Maintain active access until the scheduled end date/time is reached
        wfa.stage(_params.stages.awaitingEndTime)
        // Uses relative duration wait (1 second after end_date) to automatically initiate revocation
        wfa.flowLogic.waitForADuration({
            $id: Now.ID['flow-logic-wait-end-time'],
            uuid: '7dad58b7-f7b6-49e1-bb8d-1647da0111cf',
            durationType: 'relative_duration',
            duration: Duration({
                seconds: 1,
            }),
            relativeOperator: 'after',
            relativeDatetime: wfa.dataPill(_params.trigger.current.end_date, 'glide_date_time') as any,
        })

        // ─── Stage 5: Revoking Access ───
        // Transition stage and log audit entry before role deletion begins
        wfa.stage(_params.stages.revokingAccess)
        // Audit comment indicating role revocation process has started
        wfa.action(
            action.core.updateRecord,
            {
                $id: Now.ID['flow-action-starting-revoke-comment'],
                uuid: 'f69d32ee-a95f-4498-b7c0-bd8e674eb753',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                values: TemplateValue({
                    additional_comment: 'Starting to Revoke Access',
                }),
            }
        )
        wfa.stage(_params.stages.revokingAccess)
        // Nested loop: outer loop iterates each role in access_granted; inner loop deletes matching role assignments
        wfa.flowLogic.forEach(
            wfa.dataPill(_params.trigger.current.access_granted, 'glide_list'),
            {
                annotation: 'Revoke all granted Access',
                $id: Now.ID['flow-logic-foreach-revoke-role'],
            },
            (item_9) => {
                // Find all active sys_user_has_role assignments for the user and specific role
                const actionInstance_10 = wfa.action(
                    action.core.lookUpRecords,
                    {
                        $id: Now.ID['flow-action-lookup-granted-roles'],
                        uuid: 'a0a2bc77-e707-464c-a9ba-2de39d32beef',
                    },
                    {
                        table: 'sys_user_has_role',
                        conditions: `user=${wfa.dataPill(_params.trigger.current.user, 'reference')}^role=${wfa.dataPill(item_9, 'reference')}`,
                        sort_column: '',
                        sort_type: 'sort_asc',
                        max_results: 1000,
                    }
                )
                // Inner loop iterates over matched sys_user_has_role records to delete each
                wfa.flowLogic.forEach(
                    wfa.dataPill(actionInstance_10.Records, 'records'),
                    {
                        annotation: '',
                        $id: Now.ID['flow-logic-foreach-delete-role'],
                    },
                    (item_11) => {
                        // Delete the specific role assignment record
                        wfa.action(
                            action.core.deleteRecord,
                            {
                                $id: Now.ID['flow-action-delete-user-role'],
                                uuid: 'c2e872d0-3bed-4c5f-95ab-56a4ec45f945',
                            },
                            {
                                record: wfa.dataPill(item_11, 'string'),
                            }
                        )
                    }
                )
            }
        )

        // ─── Stage 6: Access Revoked & Notification ───
        // Update record status to granted=false and append audit comment
        wfa.stage(_params.stages.accessRevoked)
        wfa.action(
            action.core.updateRecord,
            {
                $id: Now.ID['flow-action-access-revoked-update'],
                uuid: '669449b4-c8dd-460a-838c-acc75197e35c',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                values: TemplateValue({
                    additional_comment: wfa.inlineScript(`return 'Access Revoked';`),
                    granted: 'false',
                }),
            }
        )
        wfa.stage(_params.stages.accessRevoked)
        // Dispatch 'Access Revoked' notification alerting user and stakeholders that access has ended
        wfa.action(
            action.core.sendNotification,
            {
                $id: Now.ID['flow-action-send-access-revoked-notification'],
                uuid: '81e64f01-a433-4c33-bc04-a94fee29df59',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                notification: '2eb1319483b826104cd2c900feaad38b',
            }
        )

        // ─── Stage 7: Completed ───
        // Transition to completed stage and log final audit entry
        wfa.stage(_params.stages.completed)
        wfa.action(
            action.core.updateRecord,
            {
                $id: Now.ID['flow-action-completed-update'],
                uuid: '8d9c51de-ce8e-48c1-848e-71d46a0c9818',
            },
            {
                record: wfa.dataPill(_params.trigger.current, 'reference'),
                table_name: 'x_1297430_sncadmin_temporary_access',
                values: TemplateValue({
                    additional_comment: 'Flow Completed',
                }),
            }
        )
    }
)
