interface OrderStatusesFormat {

    label: string;
    label_en: string;
    value: string;
    letters_color: string;
    background_color: string;
    order: number;

}


export const all_order_statuses: OrderStatusesFormat[] = [

    { label: 'Confirmed', label_en: 'Confirmed', value: 'confirmed', letters_color: '#fffae6', background_color: '#ffcc00', order: 1 },
    { label: 'Sent', label_en: 'Sent', value: 'sent', letters_color: '#adadeb', background_color: '#3333cc', order: 2 },
    { label: 'Completed', label_en: 'Completed', value: 'completed', letters_color: '#00b300', background_color: '#ccffcc', order: 3 },
    { label: 'Returned', label_en: 'Returned', value: 'returned', letters_color: '#f2f2f2', background_color: '#a6a6a6', order: 4 },
    { label: 'Cancelled', label_en: 'Cancelled', value: 'archived', letters_color: '#ffe6e6', background_color: '#cc0000', order: 5 },

];


export const order_statuses_order_confirmed: OrderStatusesFormat[] = [

    { label: 'Sent', label_en: 'Sent', value: 'sent', letters_color: '#adadeb', background_color: '#3333cc', order: 1 },
    { label: 'Completed', label_en: 'Completed', value: 'completed', letters_color: '#00b300', background_color: '#ccffcc', order: 2 },
    { label: 'Returned', label_en: 'Returned', value: 'returned', letters_color: '#f2f2f2', background_color: '#a6a6a6', order: 3 },
    { label: 'Cancelled', label_en: 'Cancelled', value: 'archived', letters_color: '#ffe6e6', background_color: '#cc0000', order: 4 },

];



export const order_statuses_order_sent: OrderStatusesFormat[] = [

    { label: 'Completed', label_en: 'Completed', value: 'completed', letters_color: '#00b300', background_color: '#ccffcc', order: 1 },
    { label: 'Returned', label_en: 'Returned', value: 'returned', letters_color: '#f2f2f2', background_color: '#a6a6a6', order: 2 },
    { label: 'Cancelled', label_en: 'Cancelled', value: 'archived', letters_color: '#ffe6e6', background_color: '#cc0000', order: 3 },

];


export const order_statuses_order_completed: OrderStatusesFormat[] = [

    { label: 'Returned', label_en: 'Returned', value: 'returned', letters_color: '#f2f2f2', background_color: '#a6a6a6', order: 1 },
    { label: 'Cancelled', label_en: 'Cancelled', value: 'archived', letters_color: '#ffe6e6', background_color: '#cc0000', order: 2 },

];
