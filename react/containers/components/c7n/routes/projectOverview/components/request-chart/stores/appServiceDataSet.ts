/* eslint-disable import/no-anonymous-default-export */
import { appServiceApiConfig } from '@/apis';

export default () => ({
  autoQuery: true,
  pageSize: 10,
  fields: [
    {
      name: 'appService',
      type: 'object',
      textField: 'name',
      valueField: 'id',
      lookupAxiosConfig: ({ params }:any) => (appServiceApiConfig.getRequestChartAppService(params.params ? { params: [params.params] } : {} as any)),
    },
  ],
});
