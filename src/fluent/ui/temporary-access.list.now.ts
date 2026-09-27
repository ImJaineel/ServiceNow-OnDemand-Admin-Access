import { List, default_view } from '@servicenow/sdk/core'

export const temporaryAccessList = List({
    table: 'x_1297430_sncadmin_temporary_access',
    view: default_view,
    columns: [
        'number',
        'access_granted',
        'user',
        'granted',
        'start_date',
        'end_date',
        'request_ticket',
        'watchlist',
        'additional_comment',
        'sys_updated_by',
        'sys_updated_on',
        'sys_created_by',
        'sys_created_on',
    ],
})
