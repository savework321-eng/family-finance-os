/**
 * @file Database infrastructure manager for identifier generation.
 *
 * Generates UUID-based identifiers with optional prefix and timestamp support.
 * This file does not implement repository, service, controller, or business
 * logic responsibilities.
 */

(function configureIdGenerator(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Database = root.PFOS.Core.Database || {};

    var SEPARATOR = '-';
    var TIMESTAMP_PATTERN = 'yyyyMMddHHmmss';

    /**
     * Gets core configuration.
     *
     * @private
     * @returns {Readonly<Object>} Core configuration.
     */
    function getCoreConfig() {
        return root.PFOS.Core.Config.CoreConfig;
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
     * Formats the current timestamp.
     *
     * @private
     * @returns {string} Formatted timestamp.
     */
    function createTimestamp() {
        return Utilities.formatDate(new Date(), getCoreConfig().TIME_ZONE, TIMESTAMP_PATTERN);
    }

    /**
     * Builds an identifier from nonblank parts.
     *
     * @private
     * @param {Array<string>} parts Identifier parts.
     * @returns {string} Generated identifier.
     */
    function joinIdentifierParts(parts) {
        return parts.filter(function keepPart(part) {
            return !isBlank(part);
        }).join(SEPARATOR);
    }

    /**
     * Generates database identifiers for the core database layer.
     *
     * @namespace PFOS.Core.Database.IdGenerator
     */
    root.PFOS.Core.Database.IdGenerator = Object.freeze({
        /**
         * Generates a UUID.
         *
         * @public
         * @returns {string} Generated UUID.
         */
        generateUuid: function generateUuid() {
            return Utilities.getUuid();
        },

        /**
         * Generates a UUID with an optional prefix.
         *
         * @public
         * @param {string=} prefix Optional identifier prefix.
         * @returns {string} Generated identifier.
         */
        generateWithPrefix: function generateWithPrefix(prefix) {
            return joinIdentifierParts([prefix, this.generateUuid()]);
        },

        /**
         * Generates an identifier with a timestamp and UUID.
         *
         * @public
         * @param {string=} prefix Optional identifier prefix.
         * @returns {string} Generated identifier with timestamp.
         */
        generateWithTimestamp: function generateWithTimestamp(prefix) {
            return joinIdentifierParts([prefix, createTimestamp(), this.generateUuid()]);
        }
    });
})(globalThis);
