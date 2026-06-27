/**
 * @file Centralized log levels for Family Finance OS.
 *
 * Defines immutable logging level names used by the core logging abstraction.
 * This file contains no logging side effects.
 */

(function configureLogLevel(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Logging = root.PFOS.Core.Logging || {};

    /**
     * Centralized PFOS log levels.
     *
     * @namespace PFOS.Core.Logging.LogLevel
     */
    root.PFOS.Core.Logging.LogLevel = Object.freeze({
        /** @public {string} Debug diagnostic level. */
        DEBUG: 'Debug',

        /** @public {string} Informational level. */
        INFO: 'Info',

        /** @public {string} Warning level. */
        WARNING: 'Warning',

        /** @public {string} Error level. */
        ERROR: 'Error',

        /** @public {string} Audit level. */
        AUDIT: 'Audit'
    });
})(globalThis);
