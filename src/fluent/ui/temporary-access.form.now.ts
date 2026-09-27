import { Form, default_view } from '@servicenow/sdk/core'

export const temporaryAccessForm = Form({
    table: 'x_1297430_sncadmin_temporary_access',
    view: default_view,
    sections: [
        {
            caption: 'Temporary Access',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { type: 'table_field', field: 'number' },
                        { type: 'table_field', field: 'user' },
                    ],
                    rightElements: [
                        { type: 'table_field', field: 'granted' },
                        { type: 'table_field', field: 'request_ticket' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'table_field', field: 'access_granted' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { type: 'table_field', field: 'start_date' },
                    ],
                    rightElements: [
                        { type: 'table_field', field: 'end_date' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'formatter', formatterRef: 'Activities_Filtered' },
                    ],
                },
            ],
        },
    ],
})
