/**
 * @file Configuration exception class for Family Finance OS.
 *
 * Defines the core exception used for configuration failures. This file
 * contains no configuration loading or mutation logic.
 */

(function configureConfigurationException(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Exceptions = root.PFOS.Core.Exceptions || {};

    var DEFAULT_ERROR_CODE = 'CONFIGURATION_ERROR';
    var DEFAULT_ERROR_MESSAGE = 'Configuration error occurred.';

    /**
     * Exception for configuration-related failures.
     *
     * @extends PFOS.Core.Exceptions.PFOSException
     */
    class ConfigurationException extends root.PFOS.Core.Exceptions.PFOSException {
        /**
         * Creates a configuration exception.
         *
         * @public
         * @param {string=} message Error message.
         * @param {Object=} details Additional non-sensitive configuration details.
         */
        constructor(message, details) {
            super(message || DEFAULT_ERROR_MESSAGE, {
                code: DEFAULT_ERROR_CODE,
                details: details
            });
        }
    }

    root.PFOS.Core.Exceptions.ConfigurationException = ConfigurationException;
})(globalThis);
