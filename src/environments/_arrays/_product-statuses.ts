export const products_statuses: {
    label: string;
    value: string;
}[] = [

        { label: 'All', value: 'all' },
        { label: 'In stock', value: 'in_stock' },
        { label: 'Available 1 to 3 days', value: 'available_1_to_3_days' },
        { label: 'Available 1 to 10 days', value: 'available_1_to_10_days' },
        { label: 'Available 1 to 30 days', value: 'available_1_to_30_days' },
        { label: 'With order', value: 'with_order' },
        { label: 'Unavailable', value: 'unavailable' },
        { label: 'Temporary unavailable', value: 'temporary_unavailable' },
        { label: 'Out of stock', value: 'out_of_stock' },
        { label: 'Ended', value: 'ended' },
        { label: 'Closed', value: 'closed' },

    ];







export const products_statuses_dropdown_menu: {
    label: string;
    label_en: string;
    value: string;
    letters_color: string;
    background_color: string;
    order: number;
}[] = [

        { label: 'In stock', label_en: 'In stock', value: 'in_stock', letters_color: '#ccffcc', background_color: '#00b300', order: 0 },
        { label: 'Available 1 to 3 days', label_en: 'Available 1 to 3 days', value: 'available_1_to_3_days', letters_color: '#fffae6', background_color: '#ffcc00', order: 1 },
        { label: 'Available 1 to 10 days', label_en: 'Available 1 to 10 days', value: 'available_1_to_10_days', letters_color: '#ffd1b3', background_color: '#ff6600', order: 2 },
        { label: 'Available 1 to 30 days', label_en: 'Available 1 to 30 days', value: 'available_1_to_30_days', letters_color: '#ffd1b3', background_color: '#ff6600', order: 3 },
        { label: 'With order', label_en: 'With order', value: 'with_order', letters_color: '#ff6600', background_color: '#ffd1b3', order: 4 },
        { label: 'Unavailable', label_en: 'Unavailable', value: 'unavailable', letters_color: '#f2f2f2', background_color: '#808080', order: 5 },
        { label: 'Temporary unavailable', label_en: 'Temporary unavailable', value: 'temporary_unavailable', letters_color: '#f2f2f2', background_color: '#808080', order: 6 },
        { label: 'Out of stock', label_en: 'Out of stock', value: 'out_of_stock', letters_color: '#808080', background_color: '#f2f2f2', order: 7 },
        { label: 'Ended', label_en: 'Ended', value: 'ended', letters_color: '#ffe6e6', background_color: '#ff5050', order: 8 },
        { label: 'Closed', label_en: 'Closed', value: 'closed', letters_color: '#ccc', background_color: '#cc0000', order: 9 },

    ];
