/**
 * @file Defines the global namespace used by Family Finance OS.
 */

/**
 * Root namespace for all Family Finance OS modules.
 *
 * Google Apps Script evaluates files in a shared global scope. Keeping all
 * modules under PFOS prevents global name collisions while preserving a clear
 * Clean Architecture module boundary.
 *
 * @namespace PFOS
 */
var PFOS = globalThis.PFOS || {};

/**
 * Core framework namespace.
 *
 * @namespace PFOS.Core
 */
PFOS.Core = PFOS.Core || {};

/**
 * Configuration namespace for application constants and settings.
 *
 * @namespace PFOS.Core.Config
 */
PFOS.Core.Config = PFOS.Core.Config || {};

/**
 * Backend namespace reserved for controller, service, and repository modules.
 *
 * @namespace PFOS.Backend
 */
PFOS.Backend = PFOS.Backend || {};

/**
 * Shared namespace reserved for utilities, helpers, validators, and enums.
 *
 * @namespace PFOS.Shared
 */
PFOS.Shared = PFOS.Shared || {};

/**
 * Frontend namespace reserved for server-rendered frontend helpers.
 *
 * @namespace PFOS.Frontend
 */
PFOS.Frontend = PFOS.Frontend || {};

globalThis.PFOS = PFOS;
