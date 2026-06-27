/**
 * @file Abstract repository foundation for spreadsheet-backed repositories.
 *
 * Provides generic CRUD, sheet access, header access, schema validation, row
 * mapping, read-only lookup, and common validation support for repository
 * implementations. This file contains no business repository or business
 * rules.
 */

(function configureBaseRepository(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Backend = root.PFOS.Backend || {};
    root.PFOS.Backend.Repositories = root.PFOS.Backend.Repositories || {};

    var FIRST_DATA_ROW_INDEX = 2;
    var FIRST_COLUMN_INDEX = 1;

    var ERROR_MESSAGE = Object.freeze({
        ABSTRACT_CLASS: 'BaseRepository is abstract and must be extended.',
        SHEET_NAME_REQUIRED: 'Repository sheet name is required.',
        PRIMARY_KEY_REQUIRED: 'Repository primary key header is required.',
        RECORD_REQUIRED: 'Record must be a plain object.',
        CRITERIA_REQUIRED: 'Criteria must be a plain object.',
        HEADER_REQUIRED: 'Header name is required.',
        UNKNOWN_FIELD: 'Record contains a field that is not present in sheet headers.',
        REQUIRED_FIELD: 'Required field is missing.',
        RECORD_NOT_FOUND: 'Record was not found.'
    });

    function getSpreadsheetManager() {
        return root.PFOS.Core.Database.SpreadsheetManager;
    }

    function getSheetManager() {
        return root.PFOS.Core.Database.SheetManager;
    }

    function getMetadataManager() {
        return root.PFOS.Core.Database.MetadataManager;
    }

    function getSchemaManager() {
        return root.PFOS.Core.Database.SchemaManager;
    }

    function isBlank(value) {
        return value === null || value === undefined || String(value).trim() === '';
    }

    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function cloneObject(value) {
        return Object.assign({}, value);
    }

    function requireText(value, errorMessage) {
        if (isBlank(value)) {
            throw new Error(errorMessage);
        }

        return String(value).trim();
    }

    /**
     * Generic spreadsheet-backed repository foundation.
     *
     * @abstract
     */
    class BaseRepository {
        /**
         * Creates a repository foundation instance.
         *
         * @public
         * @param {Object} options Repository options.
         * @param {string} options.sheetName Sheet name handled by the repository.
         * @param {string=} options.primaryKeyHeader Primary key header name.
         * @param {Object=} options.schema Optional sheet schema.
         * @param {GoogleAppsScript.Spreadsheet.Spreadsheet=} options.spreadsheet Optional spreadsheet.
         * @throws {Error} When instantiated directly or required options are missing.
         */
        constructor(options) {
            if (new.target === BaseRepository) {
                throw new Error(ERROR_MESSAGE.ABSTRACT_CLASS);
            }

            this.sheetName = requireText(options && options.sheetName, ERROR_MESSAGE.SHEET_NAME_REQUIRED);
            this.primaryKeyHeader = options && options.primaryKeyHeader ? String(options.primaryKeyHeader).trim() : '';
            this.schema = options && options.schema ? cloneObject(options.schema) : null;
            this.spreadsheet = options && options.spreadsheet ? options.spreadsheet : null;
        }

        /**
         * Gets the repository spreadsheet.
         *
         * @public
         * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} Spreadsheet instance.
         */
        getSpreadsheet() {
            if (this.spreadsheet) {
                getSpreadsheetManager().validateSpreadsheet(this.spreadsheet);

                return this.spreadsheet;
            }

            this.spreadsheet = getSpreadsheetManager().openSpreadsheet();

            return this.spreadsheet;
        }

        /**
         * Gets the repository sheet.
         *
         * @public
         * @returns {GoogleAppsScript.Spreadsheet.Sheet} Sheet instance.
         */
        getSheet() {
            return getSheetManager().getSheet(this.sheetName, this.getSpreadsheet());
        }

        /**
         * Reads repository headers.
         *
         * @public
         * @returns {Array<string>} Header names.
         */
        getHeaders() {
            return getMetadataManager().readHeaders(this.sheetName, this.getSpreadsheet());
        }

        /**
         * Gets the one-based column index for a header.
         *
         * @public
         * @param {string} headerName Header name.
         * @returns {number} One-based column index.
         */
        getColumnIndex(headerName) {
            return getMetadataManager().getColumnIndex(
                this.sheetName,
                requireText(headerName, ERROR_MESSAGE.HEADER_REQUIRED),
                this.getSpreadsheet()
            );
        }

        /**
         * Validates this repository sheet schema.
         *
         * @public
         * @returns {boolean} True when schema validation passes.
         */
        validateSchema() {
            if (this.schema) {
                getSchemaManager().validateSheetSchema(this.schema, this.getSpreadsheet());

                return true;
            }

            getSheetManager().validateSheetExists(this.sheetName, this.getSpreadsheet());
            getSchemaManager().validateDuplicatedHeaders(this.sheetName, this.getSpreadsheet());

            return true;
        }

        /**
         * Maps a sheet row to a record object.
         *
         * @public
         * @param {Array<*>} rowValues Row values.
         * @param {Array<string>=} headers Optional header names.
         * @returns {Object} Mapped record.
         */
        mapRowToRecord(rowValues, headers) {
            var resolvedHeaders = headers || this.getHeaders();
            var record = {};

            resolvedHeaders.forEach(function mapHeader(header, index) {
                if (!isBlank(header)) {
                    record[header] = rowValues[index];
                }
            });

            return record;
        }

        /**
         * Maps a record object to sheet row values.
         *
         * @public
         * @param {Object} record Record to map.
         * @param {Array<string>=} headers Optional header names.
         * @returns {Array<*>} Row values.
         */
        mapRecordToRow(record, headers) {
            var resolvedHeaders = headers || this.getHeaders();

            this.validateRecord(record);

            return resolvedHeaders.map(function mapValue(header) {
                return isBlank(header) ? '' : record[header];
            });
        }

        /**
         * Creates a record by appending a mapped row.
         *
         * @public
         * @param {Object} record Record to create.
         * @returns {Object} Created record.
         */
        create(record) {
            var headers = this.getHeaders();

            this.validateRecord(record);
            this.validateKnownFields(record, headers);
            this.validateRequiredFields(record);
            this.getSheet().appendRow(this.mapRecordToRow(record, headers));
            this.clearMetadataCache();

            return cloneObject(record);
        }

        /**
         * Finds all records in the repository sheet.
         *
         * @public
         * @returns {Array<Object>} Mapped records.
         */
        findAll() {
            var headers = this.getHeaders();

            return this.readRows().map(function mapRecord(row) {
                return this.mapRowToRecord(row, headers);
            }, this);
        }

        /**
         * Finds a record by primary key value.
         *
         * @public
         * @param {*} primaryKeyValue Primary key value.
         * @returns {Object|null} Matching record or null.
         */
        findById(primaryKeyValue) {
            var rowMatch = this.findRowByPrimaryKey(primaryKeyValue);

            return rowMatch ? rowMatch.record : null;
        }

        /**
         * Updates a record by primary key value.
         *
         * @public
         * @param {*} primaryKeyValue Primary key value.
         * @param {Object} changes Changes to apply.
         * @returns {Object} Updated record.
         * @throws {Error} When the record is not found.
         */
        updateById(primaryKeyValue, changes) {
            var rowMatch = this.findRowByPrimaryKey(primaryKeyValue);
            var updatedRecord;

            if (!rowMatch) {
                throw new Error(ERROR_MESSAGE.RECORD_NOT_FOUND);
            }

            this.validateRecord(changes);
            updatedRecord = Object.assign({}, rowMatch.record, changes);
            this.validateKnownFields(updatedRecord, rowMatch.headers);
            this.validateRequiredFields(updatedRecord);
            this.getSheet().getRange(rowMatch.rowNumber, FIRST_COLUMN_INDEX, 1, rowMatch.headers.length)
                .setValues([this.mapRecordToRow(updatedRecord, rowMatch.headers)]);

            return updatedRecord;
        }

        /**
         * Deletes a record by primary key value.
         *
         * @public
         * @param {*} primaryKeyValue Primary key value.
         * @returns {boolean} True when the record is deleted.
         * @throws {Error} When the record is not found.
         */
        deleteById(primaryKeyValue) {
            var rowMatch = this.findRowByPrimaryKey(primaryKeyValue);

            if (!rowMatch) {
                throw new Error(ERROR_MESSAGE.RECORD_NOT_FOUND);
            }

            this.getSheet().deleteRow(rowMatch.rowNumber);
            this.clearMetadataCache();

            return true;
        }

        /**
         * Finds records matching exact criteria.
         *
         * @public
         * @param {Object} criteria Field-value criteria.
         * @returns {Array<Object>} Matching records.
         */
        findWhere(criteria) {
            this.validateCriteria(criteria);

            return this.findAll().filter(function isMatch(record) {
                return Object.keys(criteria).every(function matchesField(fieldName) {
                    return record[fieldName] === criteria[fieldName];
                });
            });
        }

        /**
         * Finds the first record matching exact criteria.
         *
         * @public
         * @param {Object} criteria Field-value criteria.
         * @returns {Object|null} Matching record or null.
         */
        findOneWhere(criteria) {
            var matches = this.findWhere(criteria);

            return matches.length > 0 ? matches[0] : null;
        }

        /**
         * Counts records in the repository sheet.
         *
         * @public
         * @returns {number} Record count.
         */
        count() {
            return this.readRows().length;
        }

        /**
         * Determines whether a record exists by primary key value.
         *
         * @public
         * @param {*} primaryKeyValue Primary key value.
         * @returns {boolean} True when a record exists.
         */
        existsById(primaryKeyValue) {
            return this.findById(primaryKeyValue) !== null;
        }

        /**
         * Validates a record object.
         *
         * @public
         * @param {Object} record Record to validate.
         * @returns {boolean} True when the record is valid.
         */
        validateRecord(record) {
            if (!isPlainObject(record)) {
                throw new Error(ERROR_MESSAGE.RECORD_REQUIRED);
            }

            return true;
        }

        /**
         * Validates criteria object input.
         *
         * @public
         * @param {Object} criteria Criteria to validate.
         * @returns {boolean} True when criteria is valid.
         */
        validateCriteria(criteria) {
            if (!isPlainObject(criteria)) {
                throw new Error(ERROR_MESSAGE.CRITERIA_REQUIRED);
            }

            this.validateKnownFields(criteria, this.getHeaders());

            return true;
        }

        /**
         * Validates all record fields exist in sheet headers.
         *
         * @public
         * @param {Object} record Record to validate.
         * @param {Array<string>=} headers Optional header names.
         * @returns {boolean} True when all fields are known.
         */
        validateKnownFields(record, headers) {
            var headerLookup = {};

            (headers || this.getHeaders()).forEach(function mapHeader(header) {
                headerLookup[header] = true;
            });

            Object.keys(record).forEach(function inspectField(fieldName) {
                if (!headerLookup[fieldName]) {
                    throw new Error(ERROR_MESSAGE.UNKNOWN_FIELD + ': ' + fieldName);
                }
            });

            return true;
        }

        /**
         * Validates required fields from the repository schema.
         *
         * @public
         * @param {Object} record Record to validate.
         * @returns {boolean} True when required fields are present.
         */
        validateRequiredFields(record) {
            var requiredColumns = this.schema && Array.isArray(this.schema.requiredColumns)
                ? this.schema.requiredColumns
                : [];

            requiredColumns.forEach(function inspectRequiredField(fieldName) {
                if (isBlank(record[fieldName])) {
                    throw new Error(ERROR_MESSAGE.REQUIRED_FIELD + ': ' + fieldName);
                }
            });

            return true;
        }

        /**
         * Clears cached metadata for this repository sheet.
         *
         * @public
         * @returns {boolean} True when cache clear completes.
         */
        clearMetadataCache() {
            return getMetadataManager().clearCache(this.sheetName, this.getSpreadsheet());
        }

        /**
         * Reads raw data rows from the repository sheet.
         *
         * @protected
         * @returns {Array<Array<*>>} Raw row values.
         */
        readRows() {
            var sheet = this.getSheet();
            var lastRow = sheet.getLastRow();
            var lastColumn = sheet.getLastColumn();

            if (lastRow < FIRST_DATA_ROW_INDEX || lastColumn < FIRST_COLUMN_INDEX) {
                return [];
            }

            return sheet.getRange(FIRST_DATA_ROW_INDEX, FIRST_COLUMN_INDEX, lastRow - 1, lastColumn).getValues();
        }

        /**
         * Finds row metadata by primary key value.
         *
         * @protected
         * @param {*} primaryKeyValue Primary key value.
         * @returns {Object|null} Row match metadata or null.
         */
        findRowByPrimaryKey(primaryKeyValue) {
            var primaryKeyHeader = requireText(this.primaryKeyHeader, ERROR_MESSAGE.PRIMARY_KEY_REQUIRED);
            var headers = this.getHeaders();
            var primaryKeyIndex = headers.indexOf(primaryKeyHeader);
            var rows = this.readRows();
            var rowIndex;
            var record;

            if (primaryKeyIndex < 0) {
                this.getColumnIndex(primaryKeyHeader);
            }

            for (rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
                if (rows[rowIndex][primaryKeyIndex] === primaryKeyValue) {
                    record = this.mapRowToRecord(rows[rowIndex], headers);

                    return Object.freeze({
                        rowNumber: rowIndex + FIRST_DATA_ROW_INDEX,
                        headers: headers,
                        record: record
                    });
                }
            }

            return null;
        }
    }

    root.PFOS.Backend.Repositories.BaseRepository = BaseRepository;
})(globalThis);
