/**
 * @file Defines immutable business and framework constants.
 */

var PFOS = globalThis.PFOS || {};
PFOS.Core = PFOS.Core || {};
PFOS.Core.Config = PFOS.Core.Config || {};
globalThis.PFOS = PFOS;

(function configureConstants(root) {
    /**
     * Application constants shared across PFOS layers.
     *
     * @namespace PFOS.Core.Config.Constants
     */
    root.PFOS.Core.Config.Constants = Object.freeze({
        /**
         * Record lifecycle statuses from the data dictionary.
         *
         * @public
         * @type {Readonly<Object>}
         */
        STATUS: Object.freeze({
            ACTIVE: 'Active',
            INACTIVE: 'Inactive',
            ARCHIVED: 'Archived'
        }),

        /**
         * Family authorization roles from the security rules.
         *
         * @public
         * @type {Readonly<Object>}
         */
        ROLE: Object.freeze({
            OWNER: 'Owner',
            PARTNER: 'Partner',
            FUTURE_FAMILY_MEMBER: 'Future Family Member'
        }),

        /**
         * Financial profile names from the business rules.
         *
         * @public
         * @type {Readonly<Object>}
         */
        PROFILE: Object.freeze({
            PERSONAL: 'Personal',
            FAMILY: 'Family'
        }),

        /**
         * Supported transaction types from the business rules.
         *
         * @public
         * @type {Readonly<Object>}
         */
        TRANSACTION_TYPE: Object.freeze({
            INCOME: 'Income',
            EXPENSE: 'Expense'
        }),

        /**
         * Audited data modification actions from the audit rules.
         *
         * @public
         * @type {Readonly<Object>}
         */
        AUDIT_ACTION: Object.freeze({
            CREATE: 'Create',
            UPDATE: 'Update',
            DELETE: 'Delete'
        }),

        /**
         * Standard API response states from the API design.
         *
         * @public
         * @type {Readonly<Object>}
         */
        RESPONSE_STATUS: Object.freeze({
            SUCCESS: true,
            ERROR: false
        }),

        /**
         * Log levels used by backend logging.
         *
         * @public
         * @type {Readonly<Object>}
         */
        LOG_LEVEL: Object.freeze({
            INFO: 'Info',
            WARNING: 'Warning',
            ERROR: 'Error'
        })
    });

    /**
     * Backward-compatible alias for application constants.
     *
     * @public
     * @type {Readonly<Object>}
     */
    root.PFOS.Constants = root.PFOS.Core.Config.Constants;
})(globalThis);
