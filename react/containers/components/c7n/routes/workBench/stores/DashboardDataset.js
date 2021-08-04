import { map, get, filter } from 'lodash';
import JsonBig from 'json-bigint';
import mappings from './mappings';

/* eslint-disable import/no-anonymous-default-export */
export default () => ({
  paging: false,
  autoQuery: false,
  transport: {
    read: ({ data }) => {
      const { dashboardId } = data;
      return {
        url: `iam/v1/dashboard-layouts/${dashboardId}`,
        params: {},
        method: 'get',
        transformResponse: (value) => {
          try {
            if (value) {
              const tempData = JsonBig.parse(value);
              let res = [];
              if (tempData) {
                res = tempData.map((card) => {
                  const { maxH, maxW, ...rest } = card;
                  return { ...rest, i: card.cardCode };
                });
              }
              return res;
            }
            // workBenchUseStore.setInitData(res);
          } catch (error) {
            return error;
          }
        },
      };
    },
  },
  fields: [
    {
      name: 'cardId',
      type: 'string',
    },
    {
      name: 'cardCode',
      type: 'string',
    },
  ],
});
