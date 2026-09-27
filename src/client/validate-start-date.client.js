/**
 * @file Catalog Client Script — Start Date Validation (onChange)
 * @description Validates that the selected start date/time is at least 30 minutes in the future.
 * Prevents users from requesting immediate admin access to ensure an operational and security lead time buffer.
 * If validation fails, clears the field value and presents an error message to the user.
 * Target Variable: `start_date_and_time` on the Request Admin Access catalog item.
 * @module client/validate-start-date
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

/**
 * Handles onChange event for the start_date_and_time catalog item variable.
 * Enforces a minimum 30-minute lead time buffer from current client time.
 * Note: Uses client-side Date comparison based on browser local timezone.
 *
 * @param {HTMLElement} control - The form element control that triggered the change.
 * @param {string} oldValue - The prior value of the field before change.
 * @param {string} newValue - The new date/time string entered by the user.
 * @param {boolean} isLoading - Indicates whether the form is currently loading.
 */
function onChange(control, oldValue, newValue, isLoading) {
    // ─── Guard Clause ───
    // Bypass validation during initial form render or when the field is cleared
    if (isLoading || newValue == '') {
        return;
    }

    // ─── Lead Time Calculation ───
    var startField = 'start_date_and_time';
    var now = new Date();

    // Add 30 minutes to current time to enforce security buffer against immediate escalation
    now.setMinutes(now.getMinutes() + 30);

    // ─── Date Validation ───
    var selectedStart = newValue;
    if (selectedStart) {
        var selectedStartDate = new Date(selectedStart);

        // Reject requested start times that fall within the 30-minute buffer window
        if (selectedStartDate < now) {
            // Reset input and display contextual error guidance to user
            g_form.setValue(startField, '');
            g_form.showFieldMsg(startField, 'Start date must be at least 30 minutes from now.', 'error');
        }
    }
}
