/* eslint-disable import/no-anonymous-default-export */

import { requestChartApiConfig } from '@/apis';

export default ({ mainStore }:any) => ({
  autoQuery: true,
  pageSize: 10,
  transport: {
    read: () => ({
      ...requestChartApiConfig.getRequestList(),
      transformResponse: (response:any) => {
        try {
          const res = JSON.parse(response);
          if (res && res.failed) {
            return res;
          }
          if (res?.totalElements) {
            mainStore.setTotalRequestChart(res.totalElements);
          }
          return res;
        } catch (e) {
          return response;
        }
      },
    }),
  },
  fields: [
  ],
});
