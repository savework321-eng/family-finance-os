/**
 * @file Base exception class for Family Finance OS.
 *
 * Defines the core PFOS exception type used by specialized infrastructure
 * exceptions. This file contains no business logic.
 */

(function configurePFOSException(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Exceptions = root.PFOS.Core.Exceptions || {};

    var DEFAULT_ERROR_CODE = 'PFOS_ERROR';
    var DEFAULT_ERROR_MESSAGE = 'An application error occurred.';

    /**
     * Determines whether a value is a plain object.
     *
     * @private
     * @param {*} value Value to inspect.
     * @returns {boolean} True when the value is a plain object.
     */
    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    /**
     * Clones detail data safely.
     *
     * @private
     * @param {*} details Detail data.
     * @returns {Object} Cloned details.
     */
    function cloneDetails(details) {
        return isPlainObject(details) ? Object.assign({}, details) : {};
    }

    /**
     * Base exception for PFOS application errors.
     *
     * @extends Error
     */
    class PFOSException extends Error {
        /**
         * Creates a PFOS exception.
         *
         * @public
         * @param {string=} message Error message.
         * @param {Object=} options Exception options.
         * @param {string=} options.code Machine-readable error code.
         * @param {Object=} options.details Additional non-sensitive error details.
         */
        constructor(message, options) {
            var resolvedOptions = isPlainObject(options) ? options : {};

            super(message || DEFAULT_ERROR_MESSAGE);
            this.name = this.constructor.name;
            this.code = resolvedOptions.code || DEFAULT_ERROR_CODE;
            this.details = cloneDetails(resolvedOptions.details);

            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            }
        }

        /**
         * Converts the exception into a serializable object.
         *
         * @public
         * @returns {Object} Serializable exception data.
         */
        toObject() {
            return Object.freeze({
                name: this.name,
                code: this.code,
                message: this.message,
                details: Object.freeze(Object.assign({}, this.details))
            });
        }
    }

    root.PFOS.Core.Exceptions.PFOSException = PFOSException;
})(globalThis);
