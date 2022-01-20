/* eslint-disable import/no-anonymous-default-export */
import { appServiceApiConfig } from '@/apis';

export default () => ({
  autoQuery: true,
  pageSize: 10,
  transport: {
    read: ({ params }:any) => (appServiceApiConfig.getRequestChartAppService(params.params ? { params: [params.params] } : {} as any)),
  },
  fields: [
  ],
});
