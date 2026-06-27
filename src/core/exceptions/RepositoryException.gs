/**
 * @file Repository exception class for Family Finance OS.
 *
 * Defines the core exception used by repository-layer infrastructure. This file
 * contains no repository implementation or business logic.
 */

(function configureRepositoryException(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Core = root.PFOS.Core || {};
    root.PFOS.Core.Exceptions = root.PFOS.Core.Exceptions || {};

    var DEFAULT_ERROR_CODE = 'REPOSITORY_ERROR';
    var DEFAULT_ERROR_MESSAGE = 'Repository operation failed.';

    /**
     * Exception for repository-layer failures.
     *
     * @extends PFOS.Core.Exceptions.PFOSException
     */
    class RepositoryException extends root.PFOS.Core.Exceptions.PFOSException {
        /**
         * Creates a repository exception.
         *
         * @public
         * @param {string=} message Error message.
         * @param {Object=} details Additional non-sensitive repository details.
         */
        constructor(message, details) {
            super(message || DEFAULT_ERROR_MESSAGE, {
                code: DEFAULT_ERROR_CODE,
                details: details
            });
        }
    }

    root.PFOS.Core.Exceptions.RepositoryException = RepositoryException;
})(globalThis);
