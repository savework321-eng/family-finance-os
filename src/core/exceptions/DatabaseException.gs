/**
 * @file Database exception class for Family Finance OS.
 *
 * Defines the core exception used for spreadsheet and database failures. This
 * file contains no spreadsheet access logic.
 */

(function configureDatabaseException(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Exceptions = root.PFOS.Core.Exceptions || {};

    var DEFAULT_ERROR_CODE = 'DATABASE_ERROR';
    var DEFAULT_ERROR_MESSAGE = 'Database operation failed.';

    /**
     * Exception for spreadsheet and database-related failures.
     *
     * @extends PFOS.Core.Exceptions.PFOSException
     */
    class DatabaseException extends root.PFOS.Core.Exceptions.PFOSException {
        /**
         * Creates a database exception.
         *
         * @public
         * @param {string=} message Error message.
         * @param {Object=} details Additional non-sensitive database details.
         */
        constructor(message, details) {
            super(message || DEFAULT_ERROR_MESSAGE, {
                code: DEFAULT_ERROR_CODE,
                details: details
            });
        }
    }

    root.PFOS.Core.Exceptions.DatabaseException = DatabaseException;
})(globalThis);
