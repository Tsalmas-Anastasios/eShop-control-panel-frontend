import { TemplateRef } from '@angular/core';

export interface NgxChartsData {

    view?: number[];
    results?: object[];
    scheme?: object;
    schemeType?: string;
    customColors?: any;
    animations?: boolean;
    rangeFillOpacity?: number;
    showLegend?: boolean;
    legend?: boolean;
    legendTitle?: string;
    xAxis?: boolean;
    yAxis?: boolean;
    showGridLines?: boolean;
    roundDomains?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showXAxisLabel?: boolean;
    showYAxisLabel?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    XAxisTickFormatting?: any;
    yAxisTickFormatting?: any;
    xAxisTicks?: any;
    yAxisTicks?: any;
    timeline?: boolean;
    autoScale?: boolean;
    curse?: any;
    gradient?: boolean;
    activeEntries?: object[];
    tooltipDisabled?: boolean;
    tooltipTemplate?: TemplateRef<any>;
    seriesTooltipTemplate?: TemplateRef<any>;
    referenceLines?: object[];
    showRefLines?: boolean;
    showRedLabels?: boolean;
    xScaleMin?: any;
    xScaleMax?: any;
    yScaleMin?: number;
    yScaleMax?: number;

}
