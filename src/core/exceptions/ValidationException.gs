/**
 * @file Validation exception class for Family Finance OS.
 *
 * Defines the core exception used for validation failures. This file contains
 * no business validation rules.
 */

(function configureValidationException(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Exceptions = root.PFOS.Core.Exceptions || {};

    var DEFAULT_ERROR_CODE = 'VALIDATION_ERROR';
    var DEFAULT_ERROR_MESSAGE = 'Validation failed.';

    /**
     * Exception for validation-related failures.
     *
     * @extends PFOS.Core.Exceptions.PFOSException
     */
    class ValidationException extends root.PFOS.Core.Exceptions.PFOSException {
        /**
         * Creates a validation exception.
         *
         * @public
         * @param {string=} message Error message.
         * @param {Object=} details Additional non-sensitive validation details.
         */
        constructor(message, details) {
            super(message || DEFAULT_ERROR_MESSAGE, {
                code: DEFAULT_ERROR_CODE,
                details: details
            });
        }
    }

    root.PFOS.Core.Exceptions.ValidationException = ValidationException;
})(globalThis);
