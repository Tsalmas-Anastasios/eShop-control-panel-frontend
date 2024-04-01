export class DataTableCustomModuleOptions {

    color?: string;
    header_color?: string;
    footer_color?: string;
    background_color?: string;
    font_family?: string;
    pagination_button_background?: string;
    pagination_button_border_radius?: string;
    custom_table_classes?: string[]
        | 'row-border'
        | 'column-border'
        | 'row-hover'
        | 'border-grey'
        | 'border-blue-dark'
        | 'border-blue-light'
        | 'table-letters-color-black'
        | 'table-letters-color-blue-dark'
        | 'table-letters-color-blue-light';
    header_text_align_class?: 'header-center' | 'header-left' | 'header-right';
    same_columns_as_headers: boolean;
    make_records_bold?: boolean;
    make_records_bold__field?: string;
    make_records_bold__field_value_equal?: any;

    constructor(props?: DataTableCustomModuleOptions) {

        this.color = props?.color || null;
        this.header_color = props?.header_color || null;
        this.footer_color = props?.footer_color || null;
        this.background_color = props?.background_color || null;
        this.font_family = props?.font_family || null;
        this.pagination_button_background = props?.pagination_button_background || null;
        this.pagination_button_border_radius = props?.pagination_button_border_radius || null;
        this.custom_table_classes = props?.custom_table_classes || null;
        this.header_text_align_class = props?.header_text_align_class || null;
        this.same_columns_as_headers = props?.same_columns_as_headers || true;
        this.make_records_bold = props?.make_records_bold ? true : false;
        this.make_records_bold__field = props?.make_records_bold__field || null;
        this.make_records_bold__field_value_equal = props?.make_records_bold__field_value_equal || null;

    }

}





export interface DataTableCustomModuleHeaders {

    title: string;
    field: string;
    auto_increment: boolean;
    identifier: boolean;
    width?: string;
    text_align?: string;
    header_text_align?: string;
    header_text_fields_text_align?: string;
    specify_field?: 'status_dropdown';
    initial_field?: string;

}
