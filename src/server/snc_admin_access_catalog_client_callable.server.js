/**
 * @file Client-Callable Script Include — Admin Access Role Utilities
 * @description Provides client-callable AJAX utilities for querying user administrative role memberships.
 * Extends AbstractAjaxProcessor for GlideAjax client-side calls.
 *
 * Exposes two primary methods:
 * 1. `getFineGrainedAdminRoles()`: Returns list of non-inherited admin roles (ending in '_admin') the user has,
 *    excluding 'security_admin'. Used by catalog forms to show current fine-grained roles.
 * 2. `doesUserHaveAdminOrSecurityAdmin()`: Checks if user has either admin or security_admin role. Uses app properties
 *    for role sys_id lookup. Used for pre-validation.
 *
 * Parameter: `sysparm_user` — sys_id of the user to check.
 * Note: Property references use older scope prefix `x_snc_admin.*` (legacy naming from original scope).
 *
 * @module server/snc_admin_access_catalog_client_callable
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */
var snc_admin_access_catalog_client_callable = Class.create();
snc_admin_access_catalog_client_callable.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    // ─── Method: getFineGrainedAdminRoles ───
    /**
     * Returns list of non-inherited admin roles (ending in '_admin') the user has, excluding 'security_admin'.
     * Used by catalog forms to show current fine-grained roles.
     *
     * @returns {string[]} Array of role names directly assigned to the user.
     */
    getFineGrainedAdminRoles: function() {
        // Extract sys_id of the user to check from GlideAjax parameters
        var user = this.getParameter('sysparm_user');

        var list_of_roles = [];
        var grSUHR = new GlideRecord('sys_user_has_role');
        grSUHR.addQuery('user', user);
        // Filter for role names ending with '_admin'
        grSUHR.addQuery('role.name', 'ENDSWITH', '_admin');
        // Exclude 'security_admin' as it is handled separately
        grSUHR.addQuery('role.name', 'IS NOT', 'security_admin');
        // Only return direct assignments; exclude inherited roles
        grSUHR.addQuery('inherit', false);
        grSUHR.query();
        
        while (grSUHR.next()) {
            list_of_roles.push(grSUHR.role.name.toString());
        }
        
        return list_of_roles;
    },

    // ─── Method: doesUserHaveAdminOrSecurityAdmin ───
    /**
     * Checks if user has either admin or security_admin role.
     * Uses application properties for role sys_id lookups. Used for pre-validation.
     * Note: Property references use older scope prefix `x_snc_admin.*` (legacy naming from original scope).
     *
     * @returns {boolean} True if user has either admin or security_admin role; false otherwise.
     */
    doesUserHaveAdminOrSecurityAdmin: function() {
        // Extract sys_id of the user to check from GlideAjax parameters
        var user = this.getParameter('sysparm_user');

        var grSUHR = new GlideRecord('sys_user_has_role');
        grSUHR.addQuery('user', user);
        // Query sys_id for admin role from system property (legacy naming: x_snc_admin.admin-role-sys_id)
        grSUHR.addQuery('role', gs.getProperty('x_snc_admin.admin-role-sys_id'));
        // Query sys_id for security_admin role from system property (legacy naming: x_snc_admin.scurity_admin-role-sys_id)
        grSUHR.addORQuery('role', gs.getProperty('x_snc_admin.scurity_admin-role-sys_id'));
        grSUHR.query();
        
        return grSUHR.hasNext();
    },

    type: 'snc_admin_access_catalog_client_callable'
});
