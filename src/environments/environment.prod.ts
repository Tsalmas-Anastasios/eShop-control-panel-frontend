import { environmentCommon } from './environment.common';

export const environment = {
  production: true,
  environmentName: 'production',
  params: {
    ...environmentCommon.params,
    host: 'https://demo.adorithm.com',
    front_end_host: 'https://demo.adorithm.com',
  },
  datatables: { ...environmentCommon.datatables },
  custom_dtTables: { ...environmentCommon.custom_dtTables },
  status_dropdown_options: { ...environmentCommon.status_dropdown_options },
};
