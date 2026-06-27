/**
 * @file Application logging abstraction for Family Finance OS.
 *
 * Provides centralized logging methods for infrastructure and application
 * layers. This file does not implement business logic.
 */

(function configureLogger(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Logging = root.PFOS.Core.Logging || {};

    var SENSITIVE_FIELD_PATTERN = /(password|secret|token|key|spreadsheetId)/i;
    var REDACTED_VALUE = '[REDACTED]';

    function getLogLevel() {
        return root.PFOS.Core.Logging.LogLevel;
    }

    function getCoreConfig() {
        return (root.PFOS.Core.Config && root.PFOS.Core.Config.CoreConfig) || root.PFOS.Config || {};
    }

    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function isLoggingEnabled() {
        return getCoreConfig().ENABLE_LOGGER !== false;
    }

    function isDebugEnabled() {
        return getCoreConfig().ENABLE_DEBUG === true;
    }

    function sanitizeValue(value) {
        if (Array.isArray(value)) {
            return value.map(function sanitizeArrayValue(arrayValue) {
                return sanitizeValue(arrayValue);
            });
        }

        if (isPlainObject(value)) {
            return sanitizeContext(value);
        }

        return value;
    }

    function sanitizeContext(context) {
        var sanitized = {};

        if (!isPlainObject(context)) {
            return sanitized;
        }

        Object.keys(context).forEach(function sanitizeField(fieldName) {
            sanitized[fieldName] = SENSITIVE_FIELD_PATTERN.test(fieldName)
                ? REDACTED_VALUE
                : sanitizeValue(context[fieldName]);
        });

        return sanitized;
    }

    function createLogEntry(level, message, context) {
        return Object.freeze({
            level: level,
            message: String(message || ''),
            context: Object.freeze(sanitizeContext(context)),
            timestamp: new Date().toISOString()
        });
    }

    function writeToConsole(entry) {
        var serializedEntry = JSON.stringify(entry);
        var levels = getLogLevel();

        if (levelMatches(entry.level, levels.ERROR)) {
            console.error(serializedEntry);

            return;
        }

        if (levelMatches(entry.level, levels.WARNING)) {
            console.warn(serializedEntry);

            return;
        }

        console.log(serializedEntry);
    }

    function levelMatches(level, expectedLevel) {
        return String(level) === String(expectedLevel);
    }

    /**
     * Application logging abstraction.
     *
     * @namespace PFOS.Core.Logging.Logger
     */
    root.PFOS.Core.Logging.Logger = Object.freeze({
        /**
         * Writes a log entry.
         *
         * @public
         * @param {string} level Log level.
         * @param {string} message Log message.
         * @param {Object=} context Additional non-sensitive context.
         * @returns {Object|null} Log entry or null when logging is disabled.
         */
        log: function log(level, message, context) {
            var entry;

            if (!isLoggingEnabled()) {
                return null;
            }

            entry = createLogEntry(level, message, context);
            writeToConsole(entry);

            return entry;
        },

        /**
         * Writes a debug log entry when debug logging is enabled.
         *
         * @public
         * @param {string} message Log message.
         * @param {Object=} context Additional non-sensitive context.
         * @returns {Object|null} Log entry or null when debug logging is disabled.
         */
        debug: function debug(message, context) {
            if (!isDebugEnabled()) {
                return null;
            }

            return this.log(getLogLevel().DEBUG, message, context);
        },

        /**
         * Writes an informational log entry.
         *
         * @public
         * @param {string} message Log message.
         * @param {Object=} context Additional non-sensitive context.
         * @returns {Object|null} Log entry or null when logging is disabled.
         */
        info: function info(message, context) {
            return this.log(getLogLevel().INFO, message, context);
        },

        /**
         * Writes a warning log entry.
         *
         * @public
         * @param {string} message Log message.
         * @param {Object=} context Additional non-sensitive context.
         * @returns {Object|null} Log entry or null when logging is disabled.
         */
        warning: function warning(message, context) {
            return this.log(getLogLevel().WARNING, message, context);
        },

        /**
         * Writes an error log entry.
         *
         * @public
         * @param {string} message Log message.
         * @param {Object=} context Additional non-sensitive context.
         * @returns {Object|null} Log entry or null when logging is disabled.
         */
        error: function error(message, context) {
            return this.log(getLogLevel().ERROR, message, context);
        },

        /**
         * Writes an audit log entry through the logging abstraction.
         *
         * @public
         * @param {string} message Log message.
         * @param {Object=} context Additional non-sensitive context.
         * @returns {Object|null} Log entry or null when logging is disabled.
         */
        audit: function audit(message, context) {
            return this.log(getLogLevel().AUDIT, message, context);
        }
    });
})(globalThis);
