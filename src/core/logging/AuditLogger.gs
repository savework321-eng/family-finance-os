/**
 * @file Audit logging abstraction for Family Finance OS.
 *
 * Provides audit event logging through the core logger abstraction. This file
 * does not write audit records to Spreadsheet.
 */

(function configureAuditLogger(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Logging = root.PFOS.Core.Logging || {};

    var DEFAULT_AUDIT_MESSAGE = 'Audit event recorded.';
    var ERROR_MESSAGE = Object.freeze({
        ACTION_REQUIRED: 'Audit action is required.',
        ENTITY_NAME_REQUIRED: 'Audit entity name is required.'
    });

    function isBlank(value) {
        return value === null || value === undefined || String(value).trim() === '';
    }

    function normalizeRequiredText(value, errorMessage) {
        if (isBlank(value)) {
            throw new Error(errorMessage);
        }

        return String(value).trim();
    }

    function getLogger() {
        return root.PFOS.Core.Logging.Logger;
    }

    /**
     * Audit logging abstraction.
     *
     * @namespace PFOS.Core.Logging.AuditLogger
     */
    root.PFOS.Core.Logging.AuditLogger = Object.freeze({
        /**
         * Records an audit event through the logger abstraction.
         *
         * @public
         * @param {Object} auditEvent Audit event.
         * @param {string} auditEvent.action Audited action name.
         * @param {string} auditEvent.entityName Audited entity name.
         * @param {string=} auditEvent.entityId Audited entity identifier.
         * @param {string=} auditEvent.actorId Acting member identifier.
         * @param {Object=} auditEvent.metadata Additional non-sensitive metadata.
         * @returns {Object|null} Log entry or null when logging is disabled.
         */
        record: function record(auditEvent) {
            var resolvedEvent = auditEvent || {};
            var context = {
                action: normalizeRequiredText(resolvedEvent.action, ERROR_MESSAGE.ACTION_REQUIRED),
                entityName: normalizeRequiredText(resolvedEvent.entityName, ERROR_MESSAGE.ENTITY_NAME_REQUIRED),
                entityId: resolvedEvent.entityId || '',
                actorId: resolvedEvent.actorId || '',
                metadata: resolvedEvent.metadata || {},
                occurredAt: new Date().toISOString()
            };

            return getLogger().audit(DEFAULT_AUDIT_MESSAGE, context);
        }
    });
})(globalThis);
