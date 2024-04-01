export const DataTablesDefaultSettings = {

    options: {
        responsive: false,
        lengthMenu: [
            [10, 25, 50, 100, 250, 500],
            [10, 25, 50, 100, 250, 500],
        ],
        language: {
            // lengthMenu: 'Εμφάνιση _MENU_ εγγραφών ανά σελίδα',
            // info: 'Εμφάνιση σελίδας _PAGE_ από _PAGES_', // Showing page _PAGE_ of _PAGES_
            // infoEmpty: 'Δεν βρέθηκαν εγγραφές',
            infoFiltered: '',
            // search: 'Αναζήτηση',
            // emptyTable: 'Δεν βρέθηκαν εγγραφές',
            paginate: {
                first: 'First',
                last: 'Last',
                next: 'Next',
                previous: 'Previous',
            },
            processing: 'Loading...',
        },
    },

};
