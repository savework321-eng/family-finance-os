/**
 * @file Defines deployment environment constants and helpers.
 */

var PFOS = globalThis.PFOS || {};
PFOS.Core = PFOS.Core || {};
PFOS.Core.Config = PFOS.Core.Config || {};
globalThis.PFOS = PFOS;

(function configureEnvironment(root) {
    var ENVIRONMENT_NAMES = Object.freeze({
        DEVELOPMENT: 'development',
        STAGING: 'staging',
        PRODUCTION: 'production'
    });

    var CURRENT_ENVIRONMENT = ENVIRONMENT_NAMES.DEVELOPMENT;

    /**
     * Application environment configuration.
     *
     * @namespace PFOS.Core.Config.Environment
     */
    root.PFOS.Core.Config.Environment = Object.freeze({
        /** @public {string} Development environment name. */
        DEVELOPMENT: ENVIRONMENT_NAMES.DEVELOPMENT,

        /** @public {string} Staging environment name. */
        STAGING: ENVIRONMENT_NAMES.STAGING,

        /** @public {string} Production environment name. */
        PRODUCTION: ENVIRONMENT_NAMES.PRODUCTION,

        /** @public {string} Current environment name. */
        CURRENT: CURRENT_ENVIRONMENT,

        /**
         * Gets the active environment name.
         *
         * @public
         * @returns {string} Active environment name.
         */
        getCurrent: function getCurrent() {
            return CURRENT_ENVIRONMENT;
        },

        /**
         * Determines whether the application is running in production mode.
         *
         * @public
         * @returns {boolean} True when the current environment is production.
         */
        isProduction: function isProduction() {
            return CURRENT_ENVIRONMENT === ENVIRONMENT_NAMES.PRODUCTION;
        },

        /**
         * Determines whether debug behavior is enabled for the environment.
         *
         * @public
         * @returns {boolean} True when debug behavior is enabled.
         */
        isDebugEnabled: function isDebugEnabled() {
            return root.PFOS.Core.Config.CoreConfig.ENABLE_DEBUG === true;
        }
    });

    /**
     * Backward-compatible alias for environment configuration.
     *
     * @public
     * @type {Readonly<Object>}
     */
    root.PFOS.Environment = root.PFOS.Core.Config.Environment;
})(globalThis);
