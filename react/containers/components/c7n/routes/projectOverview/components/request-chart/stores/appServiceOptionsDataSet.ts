/* eslint-disable import/no-anonymous-default-export */
import { appServiceApiConfig } from '@/apis';

export default () => ({
  autoQuery: true,
  pageSize: 10,
  transport: {
    read: ({ data }:any) => (appServiceApiConfig.getRequestChartAppService(data.key ? { params: [data.key] } : {} as any)),
  },
  fields: [
  ],
});
