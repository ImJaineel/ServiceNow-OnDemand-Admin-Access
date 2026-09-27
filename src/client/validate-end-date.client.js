/**
 * @file Catalog Client Script — End Date Validation (onChange)
 * @description Validates the end date/time variable on the Request Admin Access catalog item.
 * Enforces three critical business rules:
 * 1. End date must be strictly after start date (chronological order)
 * 2. Minimum 30-minute duration gap between start and end
 * 3. Maximum 5-day duration from start date (business rule: prevents indefinite temporary access)
 * Clears the field and shows a specific error message for each validation failure.
 * Target Variable: `end_date_and_time` on the Request Admin Access catalog item.
 * @module client/validate-end-date
 * @scope x_1297430_sncadmin
 * @sdk-version 4.12.2
 */

/**
 * Handles onChange event for the end_date_and_time catalog item variable.
 * Validates chronology, minimum window, and maximum temporary access duration.
 *
 * @param {HTMLElement} control - The form element control that triggered the change.
 * @param {string} oldValue - The prior value of the field before change.
 * @param {string} newValue - The new end date/time string entered by the user.
 * @param {boolean} isLoading - Indicates whether the form is currently loading.
 */
function onChange(control, oldValue, newValue, isLoading) {
    // ─── Guard Clause ───
    // Bypass validation during initial form load or when end date is blank
    if (isLoading || newValue == '') {
        return;
    }

    // ─── Field References ───
    var startField = 'start_date_and_time';
    var endField = 'end_date_and_time';

    var startValue = g_form.getValue(startField);
    var endValue = newValue;

    // Both dates must be present before multi-field range checks can be evaluated
    if (startValue && endValue) {
        var startDate = new Date(startValue);
        var endDate = new Date(endValue);

        // ─── Validation Rule 1: Chronological Order ───
        // Ensure end date is strictly after start date
        if (endDate <= startDate) {
            g_form.setValue(endField, '');
            g_form.showFieldMsg(endField, 'End date must be after Start date.', 'error');
            return;
        }

        // ─── Validation Rule 2: Minimum 30-Minute Gap ───
        // Ensure gap between start and end is at least 30 minutes
        var minEndTime = new Date(startDate);
        minEndTime.setMinutes(minEndTime.getMinutes() + 30);

        if (endDate < minEndTime) {
            g_form.setValue(endField, '');
            g_form.showFieldMsg(endField, 'End date must be at least 30 minutes after Start date.', 'error');
            return;
        }

        // ─── Validation Rule 3: Maximum 5-Day Duration ───
        // Business rule: 5-day max prevents indefinite temporary access
        var maxEndDate = new Date(startDate);
        maxEndDate.setDate(maxEndDate.getDate() + 5);

        if (endDate > maxEndDate) {
            g_form.setValue(endField, '');
            g_form.showFieldMsg(endField, 'Duration cannot exceed 5 days from Start date.', 'error');
        }
    }
}
