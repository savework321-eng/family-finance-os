/**
 * @file Database infrastructure manager for worksheet operations.
 *
 * Provides sheet lookup and administrative worksheet operations for the PFOS
 * core database layer. This file does not implement repository, service,
 * controller, or business logic responsibilities.
 */

(function configureSheetManager(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Database = root.PFOS.Core.Database || {};

    var ERROR_MESSAGE = Object.freeze({
        SHEET_NAME_REQUIRED: 'Sheet name is required.',
        NEW_SHEET_NAME_REQUIRED: 'New sheet name is required.',
        SHEET_NOT_FOUND: 'Sheet was not found.',
        SHEET_ALREADY_EXISTS: 'Sheet already exists.'
    });

    /**
     * Gets the spreadsheet manager dependency.
     *
     * @private
     * @returns {Readonly<Object>} Spreadsheet manager.
     */
    function getSpreadsheetManager() {
        return root.PFOS.Core.Database.SpreadsheetManager;
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
     * Normalizes a sheet name.
     *
     * @private
     * @param {string} sheetName Sheet name.
     * @returns {string} Trimmed sheet name.
     * @throws {Error} When the sheet name is blank.
     */
    function normalizeSheetName(sheetName) {
        if (isBlank(sheetName)) {
            throw new Error(ERROR_MESSAGE.SHEET_NAME_REQUIRED);
        }

        return String(sheetName).trim();
    }

    /**
     * Resolves a spreadsheet instance.
     *
     * @private
     * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
     * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Spreadsheet instance.
     */
    function resolveSpreadsheet(spreadsheet) {
        if (spreadsheet) {
            getSpreadsheetManager().validateSpreadsheet(spreadsheet);

            return spreadsheet;
        }

        return getSpreadsheetManager().openSpreadsheet();
    }

    /**
     * Gets a sheet by name without throwing when it is missing.
     *
     * @private
     * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet Spreadsheet instance.
     * @param {string} sheetName Sheet name.
     * @returns {GoogleAppsScript.Spreadsheet.Sheet|null} Sheet when found.
     */
    function findSheet(spreadsheet, sheetName) {
        return spreadsheet.getSheetByName(normalizeSheetName(sheetName));
    }

    /**
     * Manages worksheet operations for the core database layer.
     *
     * @namespace PFOS.Core.Database.SheetManager
     */
    root.PFOS.Core.Database.SheetManager = Object.freeze({
        /**
         * Gets an existing sheet by name.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {GoogleAppsScript.Spreadsheet.Sheet} Matching sheet.
         * @throws {Error} When the sheet does not exist.
         */
        getSheet: function getSheet(sheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var sheet = findSheet(resolvedSpreadsheet, sheetName);

            if (!sheet) {
                throw new Error(ERROR_MESSAGE.SHEET_NOT_FOUND + ': ' + normalizeSheetName(sheetName));
            }

            return sheet;
        },

        /**
         * Creates a new sheet.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {GoogleAppsScript.Spreadsheet.Sheet} Created sheet.
         * @throws {Error} When the sheet already exists.
         */
        createSheet: function createSheet(sheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var normalizedSheetName = normalizeSheetName(sheetName);

            if (findSheet(resolvedSpreadsheet, normalizedSheetName)) {
                throw new Error(ERROR_MESSAGE.SHEET_ALREADY_EXISTS + ': ' + normalizedSheetName);
            }

            return resolvedSpreadsheet.insertSheet(normalizedSheetName);
        },

        /**
         * Deletes an existing sheet.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when the sheet is deleted.
         */
        deleteSheet: function deleteSheet(sheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var sheet = this.getSheet(sheetName, resolvedSpreadsheet);

            resolvedSpreadsheet.deleteSheet(sheet);

            return true;
        },

        /**
         * Renames an existing sheet.
         *
         * @public
         * @param {string} currentSheetName Current sheet name.
         * @param {string} newSheetName New sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {GoogleAppsScript.Spreadsheet.Sheet} Renamed sheet.
         * @throws {Error} When the new sheet name is blank or already exists.
         */
        renameSheet: function renameSheet(currentSheetName, newSheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var normalizedNewSheetName;
            var sheet;

            if (isBlank(newSheetName)) {
                throw new Error(ERROR_MESSAGE.NEW_SHEET_NAME_REQUIRED);
            }

            normalizedNewSheetName = String(newSheetName).trim();

            if (findSheet(resolvedSpreadsheet, normalizedNewSheetName)) {
                throw new Error(ERROR_MESSAGE.SHEET_ALREADY_EXISTS + ': ' + normalizedNewSheetName);
            }

            sheet = this.getSheet(currentSheetName, resolvedSpreadsheet);
            sheet.setName(normalizedNewSheetName);

            return sheet;
        },

        /**
         * Hides an existing sheet.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {GoogleAppsScript.Spreadsheet.Sheet} Hidden sheet.
         */
        hideSheet: function hideSheet(sheetName, spreadsheet) {
            var sheet = this.getSheet(sheetName, spreadsheet);

            sheet.hideSheet();

            return sheet;
        },

        /**
         * Shows an existing sheet.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {GoogleAppsScript.Spreadsheet.Sheet} Visible sheet.
         */
        showSheet: function showSheet(sheetName, spreadsheet) {
            var sheet = this.getSheet(sheetName, spreadsheet);

            sheet.showSheet();

            return sheet;
        },

        /**
         * Determines whether a sheet exists.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when the sheet exists.
         */
        sheetExists: function sheetExists(sheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);

            return findSheet(resolvedSpreadsheet, sheetName) !== null;
        },

        /**
         * Validates that a sheet exists.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when the sheet exists.
         * @throws {Error} When the sheet does not exist.
         */
        validateSheetExists: function validateSheetExists(sheetName, spreadsheet) {
            this.getSheet(sheetName, spreadsheet);

            return true;
        }
    });
})(globalThis);
