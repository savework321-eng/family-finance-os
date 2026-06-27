/**
 * @file Database infrastructure manager for spreadsheet metadata.
 *
 * Reads spreadsheet and worksheet metadata, caches header information, and
 * supports column lookup by header name. This file does not implement
 * repository, service, controller, or business logic responsibilities.
 */

(function configureMetadataManager(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Database = root.PFOS.Core.Database || {};

    var HEADER_ROW_INDEX = 1;
    var FIRST_COLUMN_INDEX = 1;

    var ERROR_MESSAGE = Object.freeze({
        HEADER_NAME_REQUIRED: 'Header name is required.',
        HEADER_NOT_FOUND: 'Header was not found.'
    });

    var metadataCache = {};

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
     * Builds a unique metadata cache key.
     *
     * @private
     * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet Spreadsheet instance.
     * @param {string} sheetName Sheet name.
     * @returns {string} Metadata cache key.
     */
    function buildCacheKey(spreadsheet, sheetName) {
        return spreadsheet.getId() + ':' + sheetName;
    }

    /**
     * Reads headers from the first row of a sheet.
     *
     * @private
     * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet Sheet instance.
     * @returns {Array<string>} Header names.
     */
    function readHeaderRow(sheet) {
        var lastColumn = sheet.getLastColumn();

        if (lastColumn < FIRST_COLUMN_INDEX) {
            return [];
        }

        return sheet.getRange(HEADER_ROW_INDEX, FIRST_COLUMN_INDEX, HEADER_ROW_INDEX, lastColumn)
            .getValues()[0]
            .map(function normalizeHeader(header) {
                return String(header).trim();
            });
    }

    /**
     * Builds a header lookup map by one-based column index.
     *
     * @private
     * @param {Array<string>} headers Header names.
     * @returns {Object<string, number>} Header lookup map.
     */
    function buildColumnLookup(headers) {
        var lookup = {};

        headers.forEach(function mapHeader(header, index) {
            if (!isBlank(header)) {
                lookup[header] = index + FIRST_COLUMN_INDEX;
            }
        });

        return lookup;
    }

    /**
     * Manages spreadsheet metadata for the core database layer.
     *
     * @namespace PFOS.Core.Database.MetadataManager
     */
    root.PFOS.Core.Database.MetadataManager = Object.freeze({
        /**
         * Reads spreadsheet metadata.
         *
         * @public
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {Object} Spreadsheet metadata.
         */
        readSpreadsheetMetadata: function readSpreadsheetMetadata(spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);

            return Object.freeze({
                id: resolvedSpreadsheet.getId(),
                name: resolvedSpreadsheet.getName(),
                url: resolvedSpreadsheet.getUrl(),
                sheetNames: resolvedSpreadsheet.getSheets().map(function getSheetName(sheet) {
                    return sheet.getName();
                })
            });
        },

        /**
         * Reads and caches sheet headers.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {Array<string>} Header names.
         */
        readHeaders: function readHeaders(sheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var sheet = getSheetManager().getSheet(sheetName, resolvedSpreadsheet);
            var headers = readHeaderRow(sheet);
            var cacheKey = buildCacheKey(resolvedSpreadsheet, sheet.getName());

            metadataCache[cacheKey] = Object.freeze({
                headers: Object.freeze(headers.slice()),
                columnLookup: Object.freeze(buildColumnLookup(headers))
            });

            return metadataCache[cacheKey].headers.slice();
        },

        /**
         * Gets cached metadata for a sheet, reading it when missing.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {Object} Cached metadata.
         */
        getSheetMetadata: function getSheetMetadata(sheetName, spreadsheet) {
            var resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            var sheet = getSheetManager().getSheet(sheetName, resolvedSpreadsheet);
            var cacheKey = buildCacheKey(resolvedSpreadsheet, sheet.getName());

            if (!metadataCache[cacheKey]) {
                this.readHeaders(sheet.getName(), resolvedSpreadsheet);
            }

            return metadataCache[cacheKey];
        },

        /**
         * Clears cached metadata.
         *
         * @public
         * @param {string=} sheetName Optional sheet name to clear.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {boolean} True when cache clear completes.
         */
        clearCache: function clearCache(sheetName, spreadsheet) {
            var resolvedSpreadsheet;
            var cacheKeyPrefix;

            if (!sheetName) {
                metadataCache = {};

                return true;
            }

            resolvedSpreadsheet = resolveSpreadsheet(spreadsheet);
            cacheKeyPrefix = buildCacheKey(resolvedSpreadsheet, sheetName);
            delete metadataCache[cacheKeyPrefix];

            return true;
        },

        /**
         * Gets a one-based column index by header name.
         *
         * @public
         * @param {string} sheetName Sheet name.
         * @param {string} headerName Header name.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} spreadsheet Optional spreadsheet.
         * @returns {number} One-based column index.
         * @throws {Error} When the header name is blank or not found.
         */
        getColumnIndex: function getColumnIndex(sheetName, headerName, spreadsheet) {
            var metadata;
            var normalizedHeaderName;

            if (isBlank(headerName)) {
                throw new Error(ERROR_MESSAGE.HEADER_NAME_REQUIRED);
            }

            metadata = this.getSheetMetadata(sheetName, spreadsheet);
            normalizedHeaderName = String(headerName).trim();

            if (!metadata.columnLookup[normalizedHeaderName]) {
                throw new Error(ERROR_MESSAGE.HEADER_NOT_FOUND + ': ' + normalizedHeaderName);
            }

            return metadata.columnLookup[normalizedHeaderName];
        }
    });
})(globalThis);
