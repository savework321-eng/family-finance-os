/**
 * Application Constants
 */

const PFOS = PFOS || {};

PFOS.Constants = Object.freeze({

    STATUS: Object.freeze({

        ACTIVE: 'ACTIVE',

        INACTIVE: 'INACTIVE'

    }),

    ROLE: Object.freeze({

        OWNER: 'OWNER',

        PARTNER: 'PARTNER',

        CHILD: 'CHILD'

    }),

    TRANSACTION: Object.freeze({

        INCOME: 'INCOME',

        EXPENSE: 'EXPENSE',

        TRANSFER: 'TRANSFER'

    }),

    LOG_LEVEL: Object.freeze({

        INFO: 'INFO',

        WARNING: 'WARNING',

        ERROR: 'ERROR'

    })

});