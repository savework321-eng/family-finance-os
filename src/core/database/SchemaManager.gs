/**
 * @file Database infrastructure manager for spreadsheet schema validation.
 *
 * Validates required sheets, required columns, duplicated headers, and
 * caller-provided sheet schemas. This file does not implement repository,
 * service, controller, or business logic responsibilities.
 */

(function configureSchemaManager(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Database = root.PFOS.Core.Database || {};

    var ERROR_MESSAGE = Object.freeze({
        REQUIRED_COLUMNS_REQUIRED: 'Required columns are required.',
        SHEET_SCHEMA_REQUIRED: 'Sheet schema is required.',
        MISSING_SHEETS: 'Missing sheets were found.',
        MISSING_COLUMNS: 'Missing required columns were found.',
        DUPLICATED_HEADERS: 'Duplicated headers were found.'
    });

    /**
     * Gets configured sheet names.
     *
     * @private
     * @returns {Readonly<Object>} Configured sheet names.
     */
    function getSheetNamesConfig() {
        return root.PFOS.Core.Config.SheetNames;
    }

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
     * Gets the sheet manager dependency.
     *
     * @private
     * @returns {Readonly<Object>} Sheet manager.
     */
    function getSheetManager() {
        return root.PFOS.Core.Database.SheetManager;
    }

    /**
     * Gets the metadata manager dependency.
     *
     * @private
     * @returns {Readonly<Object>} Metadata manager.
     */
    function getMetadataManager() {
        return root.PFOS.Core.Database.MetadataManager;
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
     * Gets configured required sheet names.
     *
     * @private
     * @returns {Array<string>} Required sheet names.
     */
    function getConfiguredSheetNames() {
        var sheetNames = getSheetNamesConfig();

        return Object.keys(sheetNames).map(function mapSheetName(sheetKey) {
            return sheetNames[sheetKey];
        });
    }

    /**
     * Finds duplicated nonblank header names.
     *
     * @private
     * @param {Array<string>} headers Header names.
     * @returns {Array<string>} Duplicated header names.
     */
    function findDuplicatedHeaders(headers) {
        var seenHeaders = {};
        var duplicatedHeaders = {};

        headers.forEach(function inspectHeader(header) {
            if (!header) {
                return;
            }

            if (seenHeaders[header]) {
                duplicatedHeaders[header] = true;
            }

            seenHeaders[header] = true;
        });

        return Object.keys(duplicatedHeaders);
    }

    /**
     * Finds required columns missing from a header list.
     *
     * @private
     * @param {Array<string>} headers Header names.
     * @param {Array<string>} requiredColumns Required column names.
     * @returns {Array<string>} Missing column names.
     */
    function findMissingColumns(headers, requiredColumns) {
        var headerLookup = {};

        headers.forEach(function mapHeader(header) {
            headerLookup[header] = true;
        });

        return requiredColumns.filter(function isColumnMissing(columnName) {
            return !headerLookup[columnName];
        });
    }

    /**
     * Manages schema validation for the core database layer.
     *
     * @namespace PFOS.Core.Database.SchemaManager
     */
    root.PFOS.Core.Database.SchemaManager = Object.freeze({
        /**
         * Validates all configured sheets exist.
         *
         * @public
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when all configured sheets exist.
         * @throws {Error} When configured sheets are missing.
         */
        validateMissingSheets: function validateMissingSheets(spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var missingSheets = getConfiguredSheetNames().filter(function isSheetMissing(sheetName) {
                return !getSheetManager().sheetExists(sheetName, resolvedSpreadsheet);
            });

            if (missingSheets.length > 0) {
                throw new Error(ERROR_MESSAGE.MISSING_SHEETS + ': ' + missingSheets.join(', '));
            }

            return true;
        },

        /**
         * Validates a sheet has no duplicated headers.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when headers are unique.
         * @throws {Error} When duplicated headers are found.
         */
        validateDuplicatedHeaders: function validateDuplicatedHeaders(sheetName, spreadsheet) {
            var headers = getMetadataManager().readHeaders(sheetName, spreadsheet);
            var duplicatedHeaders = findDuplicatedHeaders(headers);

            if (duplicatedHeaders.length > 0) {
                throw new Error(ERROR_MESSAGE.DUPLICATED_HEADERS + ': ' + duplicatedHeaders.join(', '));
            }

            return true;
        },

        /**
         * Validates required columns exist in a sheet.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {Array<string>} requiredColumns Required column names.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when all required columns exist.
         * @throws {Error} When required columns are missing.
         */
        validateRequiredColumns: function validateRequiredColumns(sheetName, requiredColumns, spreadsheet) {
            var headers;
            var missingColumns;

            if (!Array.isArray(requiredColumns)) {
                throw new Error(ERROR_MESSAGE.REQUIRED_COLUMNS_REQUIRED);
            }

            headers = getMetadataManager().readHeaders(sheetName, spreadsheet);
            missingColumns = findMissingColumns(headers, requiredColumns);

            if (missingColumns.length > 0) {
                throw new Error(ERROR_MESSAGE.MISSING_COLUMNS + ': ' + missingColumns.join(', '));
            }

            return true;
        },

        /**
         * Validates a single sheet schema.
         *
         * @public
         * @param {Object} sheetSchema Sheet schema.
         * @param {string} sheetSchema.sheetName Sheet name.
         * @param {Array<string>} sheetSchema.requiredColumns Required column names.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when the sheet schema is valid.
         * @throws {Error} When the sheet schema is invalid.
         */
        validateSheetSchema: function validateSheetSchema(sheetSchema, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);

            if (!sheetSchema || !sheetSchema.sheetName || !Array.isArray(sheetSchema.requiredColumns)) {
                throw new Error(ERROR_MESSAGE.SHEET_SCHEMA_REQUIRED);
            }

            getSheetManager().validateSheetExists(sheetSchema.sheetName, resolvedSpreadsheet);
            this.validateDuplicatedHeaders(sheetSchema.sheetName, resolvedSpreadsheet);
            this.validateRequiredColumns(sheetSchema.sheetName, sheetSchema.requiredColumns, resolvedSpreadsheet);

            return true;
        },

        /**
         * Validates multiple sheet schemas.
         *
         * @public
         * @param {Array<Object>} sheetSchemas Sheet schemas.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when all sheet schemas are valid.
         * @throws {Error} When any sheet schema is invalid.
         */
        validateSchema: function validateSchema(sheetSchemas, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);

            if (!Array.isArray(sheetSchemas)) {
                throw new Error(ERROR_MESSAGE.SHEET_SCHEMA_REQUIRED);
            }

            sheetSchemas.forEach(function validateSingleSheetSchema(sheetSchema) {
                root.PFOS.Core.Database.SchemaManager.validateSheetSchema(sheetSchema, resolvedSpreadsheet);
            });

            return true;
        }
    });
})(globalThis);
