import { environmentCommon } from './environment.common';

export const environment = {
  production: false,
  environmentName: 'development',
  params: {
    ...environmentCommon.params,
    host: 'https://control-panel.expertin.live',
    front_end_host: 'https://localhost:4200',
  },
  datatables: { ...environmentCommon.datatables },
  custom_dtTables: { ...environmentCommon.custom_dtTables },
  status_dropdown_options: { ...environmentCommon.status_dropdown_options },
};
