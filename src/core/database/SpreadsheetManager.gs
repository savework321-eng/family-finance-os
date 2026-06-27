/**
 * @file Database infrastructure manager for Google Spreadsheet access.
 *
 * Provides spreadsheet opening and validation operations for the PFOS core
 * database layer. This file does not implement repository, service,
 * controller, or business logic responsibilities.
 */

(function configureSpreadsheetManager(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Database = root.PFOS.Core.Database || {};

    var ERROR_MESSAGE = Object.freeze({
        SPREADSHEET_ID_REQUIRED: 'Spreadsheet ID is required.',
        ACTIVE_SPREADSHEET_NOT_FOUND: 'Active spreadsheet was not found.',
        INVALID_SPREADSHEET: 'Invalid spreadsheet instance.'
    });

    /**
     * Gets core configuration.
     *
     * @private
     * @returns {Readonly<Object>} Core configuration.
     */
    function getCoreConfig() {
        return root.PFOS.Core.Config.CoreConfig;
    }

    /**
     * Determines whether a value is blank.
     *
     * @private
     * @param {*} value Value to inspect.
     * @returns {boolean} True when the value is blank.
     */
    function isBlank(value) {
        return value === null || value === undefined || String(value).trim() === '';
    }

    /**
     * Validates a spreadsheet object.
     *
     * @private
     * @param {*} spreadsheet Spreadsheet object to validate.
     * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Valid spreadsheet.
     * @throws {Error} When the spreadsheet object is invalid.
     */
    function requireSpreadsheet(spreadsheet) {
        if (!spreadsheet || typeof spreadsheet.getId !== 'function' || typeof spreadsheet.getSheets !== 'function') {
            throw new Error(ERROR_MESSAGE.INVALID_SPREADSHEET);
        }

        return spreadsheet;
    }

    /**
     * Manages Google Spreadsheet access for the core database layer.
     *
     * @namespace PFOS.Core.Database.SpreadsheetManager
     */
    root.PFOS.Core.Database.SpreadsheetManager = Object.freeze({
        /**
         * Opens the configured PFOS database spreadsheet.
         *
         * @public
         * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Configured database spreadsheet.
         */
        openSpreadsheet: function openSpreadsheet() {
            return this.getSpreadsheetById(getCoreConfig().SPREADSHEET_ID);
        },

        /**
         * Gets the currently active spreadsheet.
         *
         * @public
         * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Active spreadsheet.
         * @throws {Error} When no active spreadsheet is available.
         */
        getActiveSpreadsheet: function getActiveSpreadsheet() {
            var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

            if (!spreadsheet) {
                throw new Error(ERROR_MESSAGE.ACTIVE_SPREADSHEET_NOT_FOUND);
            }

            return requireSpreadsheet(spreadsheet);
        },

        /**
         * Opens a spreadsheet by ID.
         *
         * @public
         * @param {string} spreadsheetId Spreadsheet ID.
         * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Spreadsheet for the ID.
         * @throws {Error} When spreadsheet ID is blank or the spreadsheet is invalid.
         */
        getSpreadsheetById: function getSpreadsheetById(spreadsheetId) {
            if (isBlank(spreadsheetId)) {
                throw new Error(ERROR_MESSAGE.SPREADSHEET_ID_REQUIRED);
            }

            return requireSpreadsheet(SpreadsheetApp.openById(String(spreadsheetId).trim()));
        },

        /**
         * Validates a spreadsheet instance.
         *
         * @public
         * @param {*} spreadsheet Spreadsheet object to validate.
         * @returns {boolean} True when the spreadsheet instance is valid.
         * @throws {Error} When the spreadsheet object is invalid.
         */
        validateSpreadsheet: function validateSpreadsheet(spreadsheet) {
            requireSpreadsheet(spreadsheet);

            return true;
        }
    });
})(globalThis);
