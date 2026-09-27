/**
 * @file Flow Action Script — Terminate User Sessions
 * @description Executes session termination for a given user across all ServiceNow cluster nodes.
 * Called by the 'Terminate User's Session' Flow Designer action.
 * Uses GlideSessions.lockOutSessionsInAllNodes() to immediately terminate all active sessions.
 * This forces the user to re-authenticate after role changes, preventing stale privilege escalation.
 *
 * @module server/terminate_users_session
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

/**
 * Flow Designer action execution step.
 * Immediately invalidates active cluster-wide HTTP sessions for the target user.
 *
 * @param {Object} inputs - Flow Designer action input parameters.
 * @param {string} inputs.user_name - The user's username (sys_user.user_name) from the flow action input.
 * @param {Object} outputs - Flow Designer action output parameters.
 */
(function execute(inputs, outputs) {
    // ─── Session Termination ───
    // Immediately terminate all active sessions across all nodes to force re-authentication
    GlideSessions.lockOutSessionsInAllNodes(inputs.user_name);
})(inputs, outputs);
