// 用户视图tabs
import { map, get, filter } from 'lodash';
import JsonBig from 'json-bigint';
import mappings from './mappings';

/* eslint-disable import/no-anonymous-default-export */
export default ({
  workBenchUseStore,
}) => ({
  paging: false,
  autoQuery: true,
  fields: [{
    name: 'dashboardId',
  }],
  transport: {
    read: ({ data }) => ({
      url: 'iam/v1/dashboards',
      method: 'get',
      transformResponse: (value) => {
        try {
          const res = JsonBig.parse(value);
          workBenchUseStore.setViewData(res);
          return res;
        } catch (error) {
          return error;
        }
      },
    }),
    destroy: ({ data }) => {
      const { dashboardId } = data[0];
      return {
        url: `iam/v1/dashboards/${dashboardId}`,
        method: 'delete',
      };
    },
  },
});
