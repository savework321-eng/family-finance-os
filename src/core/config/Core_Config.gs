/**
 * ==========================================================
 * Family Finance OS (PFOS)
 * Core Configuration
 * Version : 1.0.0
 * ==========================================================
 */

const PFOS = PFOS || {};

PFOS.Config = Object.freeze({

    APP_NAME: 'Family Finance OS',

    APP_CODE: 'PFOS',

    APP_VERSION: '1.0.0',

    TIME_ZONE: 'Asia/Jakarta',

    LOCALE: 'id-ID',

    CURRENCY: 'IDR',

    DATE_FORMAT: 'yyyy-MM-dd',

    DATE_TIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',

    SPREADSHEET_ID:
        '1rMTy8cjhhyqJRRrDTqQJkda2fAa-qLOHQJjyZ2z7N4M',

    ENABLE_CACHE: true,

    ENABLE_LOGGER: true,

    ENABLE_AUDIT: true,

    ENABLE_DEBUG: false,

    CACHE_EXPIRE_SECONDS: 21600,

    LOCK_TIMEOUT_MS: 30000,

    MAX_RETRY: 3

});