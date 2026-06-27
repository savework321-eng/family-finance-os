/**
 * @file Defines immutable core application configuration.
 */

var PFOS = globalThis.PFOS || {};
PFOS.Core = PFOS.Core || {};
PFOS.Core.Config = PFOS.Core.Config || {};
globalThis.PFOS = PFOS;

(function configureCoreConfig(root) {
    /**
     * Core application configuration values.
     *
     * Values in this object come from the project documentation, spreadsheet
     * schema, and Apps Script manifest.
     *
     * @namespace PFOS.Core.Config.CoreConfig
     */
    root.PFOS.Core.Config.CoreConfig = Object.freeze({
        /** @public {string} Official application name. */
        APP_NAME: 'Family Finance OS',

        /** @public {string} Official application code. */
        APP_CODE: 'PFOS',

        /** @public {string} Current documented application version. */
        APP_VERSION: '0.1.0-alpha',

        /** @public {string} Current documented sprint. */
        CURRENT_SPRINT: 'Sprint 5',

        /** @public {string} Current documented project status. */
        PROJECT_STATUS: 'Active Development',

        /** @public {string} Apps Script manifest time zone. */
        TIME_ZONE: 'Asia/Jakarta',

        /** @public {string} Default locale for formatting. */
        LOCALE: 'id-ID',

        /** @public {string} Default currency for financial values. */
        CURRENCY: 'IDR',

        /** @public {string} Standard date format. */
        DATE_FORMAT: 'yyyy-MM-dd',

        /** @public {string} Standard date and time format. */
        DATE_TIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',

        /** @public {string} Spreadsheet database identifier. */
        SPREADSHEET_ID: '1rMTy8cjhhyqJRRrDTqQJkda2fAa-qLOHQJjyZ2z7N4M',

        /** @public {string} Database engine documented for PFOS. */
        DATABASE_ENGINE: 'Google Spreadsheet',

        /** @public {string} Backend runtime documented for PFOS. */
        BACKEND_RUNTIME: 'Google Apps Script',

        /** @public {string} Primary key strategy documented for PFOS. */
        PRIMARY_KEY_STRATEGY: 'UUID',

        /** @public {boolean} Enables cache usage where supported. */
        ENABLE_CACHE: true,

        /** @public {boolean} Enables server logging. */
        ENABLE_LOGGER: true,

        /** @public {boolean} Enables audit logging for data modifications. */
        ENABLE_AUDIT: true,

        /** @public {boolean} Enables debug behavior. */
        ENABLE_DEBUG: false,

        /** @public {number} Default cache expiration in seconds. */
        CACHE_EXPIRE_SECONDS: 21600,

        /** @public {number} Default lock wait timeout in milliseconds. */
        LOCK_TIMEOUT_MS: 30000,

        /** @public {number} Default retry count for retryable operations. */
        MAX_RETRY: 3
    });

    /**
     * Backward-compatible alias for core configuration.
     *
     * @public
     * @type {Readonly<Object>}
     */
    root.PFOS.Config = root.PFOS.Core.Config.CoreConfig;
})(globalThis);
