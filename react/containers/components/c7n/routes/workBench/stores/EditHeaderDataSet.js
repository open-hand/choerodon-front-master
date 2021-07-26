import { map, get, filter } from 'lodash';
import JsonBig from 'json-bigint';

/* eslint-disable import/no-anonymous-default-export */
export default ({
  // workBenchUseStore,
}) => ({
  paging: false,
  autoQuery: false,
  autoCreate: true,
  transport: {
    // read: ({ data }) => ({
    //   url: `iam/v1/dashboard-layouts/205085098088542208`,
    //   method: 'get',
    //   transformResponse: (value) => {
    //     try {
    //       if (value) {
    //         const tempData = JsonBig.parse(value);
    //         const res = tempData ? tempData.map((card) => ({ ...card, i: card.cardCode })) : [];
    //         return res;
    //       }
    //       // workBenchUseStore.setInitData(res);
    //     } catch (error) {
    //       return error;
    //     }
    //   },
    // }),
  },
  fields: [
    {
      name: 'dashboardName',
      type: 'string',
    },
    {
      name: 'dashboardId',
      type: 'string',
    },
    {
      name: 'internalTemplate',
      label: '官方模板布局',
      type: 'string',
      lookupCode: 'IAM.INTERNAL_DASHBOARD',
      textField: 'dashboardName',
      valueField: 'dashboardId',
      lookupAxiosConfig: () => ({
        url: '/iam/v1/dashboards/internal',
        params: { filterFlag: 0 },
        method: 'get',
        transformResponse: (res) => {
          let result = res;
          try {
            if (JsonBig.parse(result)) {
              result = JsonBig.parse(result).content;
            }
          } catch (e) {
            return result;
          }
          return result;
        },
      }),
    },
  ],
});
