/**
 * @file Defines official spreadsheet worksheet names.
 */

var PFOS = globalThis.PFOS || {};
PFOS.Core = PFOS.Core || {};
PFOS.Core.Config = PFOS.Core.Config || {};
globalThis.PFOS = PFOS;

(function configureSheetNames(root) {
    /**
     * Official worksheet names from the spreadsheet schema.
     *
     * @namespace PFOS.Core.Config.SheetNames
     */
    root.PFOS.Core.Config.SheetNames = Object.freeze({
        /** @public {string} Members worksheet. */
        MEMBERS: 'Members',

        /** @public {string} Profiles worksheet. */
        PROFILES: 'Profiles',

        /** @public {string} Accounts worksheet. */
        ACCOUNTS: 'Accounts',

        /** @public {string} Categories worksheet. */
        CATEGORIES: 'Categories',

        /** @public {string} Transactions worksheet. */
        TRANSACTIONS: 'Transactions',

        /** @public {string} Budgets worksheet. */
        BUDGETS: 'Budgets',

        /** @public {string} Goals worksheet. */
        GOALS: 'Goals',

        /** @public {string} Assets worksheet. */
        ASSETS: 'Assets',

        /** @public {string} Liabilities worksheet. */
        LIABILITIES: 'Liabilities',

        /** @public {string} Subscriptions worksheet. */
        SUBSCRIPTIONS: 'Subscriptions',

        /** @public {string} Recurring bills worksheet. */
        RECURRING_BILLS: 'RecurringBills',

        /** @public {string} Notifications worksheet. */
        NOTIFICATIONS: 'Notifications',

        /** @public {string} Settings worksheet. */
        SETTINGS: 'Settings',

        /** @public {string} Activity logs worksheet. */
        ACTIVITY_LOGS: 'ActivityLogs',

        /** @public {string} Audit logs worksheet. */
        AUDIT_LOGS: 'AuditLogs'
    });

    /**
     * Backward-compatible alias for official worksheet names.
     *
     * @public
     * @type {Readonly<Object>}
     */
    root.PFOS.Sheets = root.PFOS.Core.Config.SheetNames;
})(globalThis);
