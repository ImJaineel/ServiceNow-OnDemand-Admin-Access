/**
 * @file Terminate User Session Flow Designer Action
 * @description Custom Flow Designer action that terminates all active sessions for a specified user across all cluster nodes.
 * @module automation/actions
 * @scope x_1297430_sncadmin
 * @sdk 4.12.2
 */

import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { ReferenceColumn } from '@servicenow/sdk/core'

/**
 * Custom Flow Designer Action to terminate a user's active sessions.
 * Forces session termination across all cluster nodes when elevated privileges expire or are revoked.
 */
export const terminate_users_session = Action(
    // ─── Action Metadata & Inputs ───
    {
        $id: Now.ID['action-terminate-user-session'],
        name: "Terminate User's Session",
        internalName: 'terminate_users_session',
        inputs: {
            // Reference to the target user whose active sessions must be invalidated
            user: ReferenceColumn({
                label: 'user',
                mandatory: true,
                referenceTable: 'sys_user',
            }),
        },
        outputs: {},
        masterSnapshot: 'c53e6d5083b826104cd2c900feaad321',
    },
    // ─── Action Steps ───
    (params) => {
        // Execute server script step calling GlideSessions.lockOutSessionsInAllNodes()
        wfa.actionStep(
            actionStep.script,
            {
                $id: Now.ID['step-terminate-user-session-script'],
                label: 'Script step',
            },
            {
                // Server-side script file that executes session lockout logic
                script: Now.include('../../../server/terminate_users_session.server.js'),
                // Executes within global scope context ('35aa573fd7802200bdbaee5b5e610375') required by GlideSessions
                application: '35aa573fd7802200bdbaee5b5e610375',
                // Ensures any script failures are caught and abort the action immediately
                errorHandlingType: 'stop_the_action',
                // Runs directly on the ServiceNow instance node rather than an external MID server
                required_run_time: 'instance',
                inputVariables: {
                    // Pass the user_name string extracted from the sys_user reference record
                    user_name: {
                        label: 'user_name',
                        value: wfa.dataPill(params.inputs.user.user_name, 'string'),
                    },
                },
            }
        )
    }
)
