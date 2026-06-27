/**
 * @file Repository factory and registry for backend repository instances.
 *
 * Provides centralized repository constructor registration, instance creation,
 * singleton access, and lazy initialization. This file registers no business
 * repositories and contains no business logic.
 */

(function configureRepositoryFactory(root) {
    root.PFOS = root.PFOS || {};
    root.PFOS.Backend = root.PFOS.Backend || {};
    root.PFOS.Backend.Repositories = root.PFOS.Backend.Repositories || {};

    var ERROR_MESSAGE = Object.freeze({
        REPOSITORY_NAME_REQUIRED: 'Repository name is required.',
        REPOSITORY_CONSTRUCTOR_REQUIRED: 'Repository constructor is required.',
        REPOSITORY_ALREADY_REGISTERED: 'Repository is already registered.',
        REPOSITORY_NOT_REGISTERED: 'Repository is not registered.',
        INVALID_OPTIONS: 'Repository options must be a plain object.'
    });

    var repositoryRegistry = {};
    var singletonInstances = {};

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
     * Determines whether a value is a plain object.
     *
     * @private
     * @param {*} value Value to inspect.
     * @returns {boolean} True when the value is a plain object.
     */
    function isPlainObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    /**
     * Normalizes a repository name.
     *
     * @private
     * @param {string} repositoryName Repository registration name.
     * @returns {string} Normalized repository name.
     * @throws {Error} When the repository name is blank.
     */
    function normalizeRepositoryName(repositoryName) {
        if (isBlank(repositoryName)) {
            throw new Error(ERROR_MESSAGE.REPOSITORY_NAME_REQUIRED);
        }

        return String(repositoryName).trim();
    }

    /**
     * Validates repository options.
     *
     * @private
     * @param {Object=} options Optional repository options.
     * @returns {Object} Valid options.
     * @throws {Error} When options are not a plain object.
     */
    function validateOptions(options) {
        if (options === undefined || options === null) {
            return {};
        }

        if (!isPlainObject(options)) {
            throw new Error(ERROR_MESSAGE.INVALID_OPTIONS);
        }

        return options;
    }

    /**
     * Merges default and runtime repository options.
     *
     * @private
     * @param {Object} defaultOptions Default registration options.
     * @param {Object} runtimeOptions Runtime creation options.
     * @returns {Object} Merged options.
     */
    function mergeOptions(defaultOptions, runtimeOptions) {
        return Object.assign({}, defaultOptions, runtimeOptions);
    }

    /**
     * Creates repositories from registered constructors.
     *
     * @namespace PFOS.Backend.Repositories.RepositoryFactory
     */
    root.PFOS.Backend.Repositories.RepositoryFactory = Object.freeze({
        /**
         * Registers a repository constructor.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @param {Function} RepositoryConstructor Repository constructor.
         * @param {Object=} defaultOptions Default repository options.
         * @returns {Readonly<Object>} Repository registration.
         * @throws {Error} When registration input is invalid or duplicated.
         */
        register: function register(repositoryName, RepositoryConstructor, defaultOptions) {
            var normalizedName = normalizeRepositoryName(repositoryName);
            var resolvedDefaultOptions = validateOptions(defaultOptions);

            if (typeof RepositoryConstructor !== 'function') {
                throw new Error(ERROR_MESSAGE.REPOSITORY_CONSTRUCTOR_REQUIRED);
            }

            if (repositoryRegistry[normalizedName]) {
                throw new Error(ERROR_MESSAGE.REPOSITORY_ALREADY_REGISTERED + ': ' + normalizedName);
            }

            repositoryRegistry[normalizedName] = Object.freeze({
                name: normalizedName,
                RepositoryConstructor: RepositoryConstructor,
                defaultOptions: Object.freeze(Object.assign({}, resolvedDefaultOptions))
            });

            return repositoryRegistry[normalizedName];
        },

        /**
         * Determines whether a repository is registered.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @returns {boolean} True when the repository is registered.
         */
        has: function has(repositoryName) {
            return Boolean(repositoryRegistry[normalizeRepositoryName(repositoryName)]);
        },

        /**
         * Gets a repository registration.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @returns {Readonly<Object>} Repository registration.
         * @throws {Error} When the repository is not registered.
         */
        getRegistration: function getRegistration(repositoryName) {
            var normalizedName = normalizeRepositoryName(repositoryName);

            if (!repositoryRegistry[normalizedName]) {
                throw new Error(ERROR_MESSAGE.REPOSITORY_NOT_REGISTERED + ': ' + normalizedName);
            }

            return repositoryRegistry[normalizedName];
        },

        /**
         * Lists registered repository names.
         *
         * @public
         * @returns {Array<string>} Registered repository names.
         */
        listRegistered: function listRegistered() {
            return Object.keys(repositoryRegistry);
        },

        /**
         * Creates a new repository instance.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @param {Object=} options Runtime repository options.
         * @returns {Object} Repository instance.
         */
        create: function create(repositoryName, options) {
            var registration = this.getRegistration(repositoryName);
            var resolvedOptions = mergeOptions(registration.defaultOptions, validateOptions(options));

            return new registration.RepositoryConstructor(resolvedOptions);
        },

        /**
         * Gets a lazily initialized singleton repository instance.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @param {Object=} options Runtime repository options used on first access.
         * @returns {Object} Singleton repository instance.
         */
        getSingleton: function getSingleton(repositoryName, options) {
            var normalizedName = normalizeRepositoryName(repositoryName);

            if (!singletonInstances[normalizedName]) {
                singletonInstances[normalizedName] = this.create(normalizedName, options);
            }

            return singletonInstances[normalizedName];
        },

        /**
         * Clears a singleton repository instance.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @returns {boolean} True when the singleton reference is cleared.
         */
        clearSingleton: function clearSingleton(repositoryName) {
            delete singletonInstances[normalizeRepositoryName(repositoryName)];

            return true;
        },

        /**
         * Clears all singleton repository instances.
         *
         * @public
         * @returns {boolean} True when singleton references are cleared.
         */
        clearSingletons: function clearSingletons() {
            singletonInstances = {};

            return true;
        },

        /**
         * Unregisters a repository constructor and clears its singleton.
         *
         * @public
         * @param {string} repositoryName Repository registration name.
         * @returns {boolean} True when the registration is removed.
         */
        unregister: function unregister(repositoryName) {
            var normalizedName = normalizeRepositoryName(repositoryName);

            if (!repositoryRegistry[normalizedName]) {
                throw new Error(ERROR_MESSAGE.REPOSITORY_NOT_REGISTERED + ': ' + normalizedName);
            }

            delete repositoryRegistry[normalizedName];
            delete singletonInstances[normalizedName];

            return true;
        }
    });
})(globalThis);
