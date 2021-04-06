import { map, get, filter } from 'lodash';
import JsonBig from 'json-bigint';
import mappings from './mappings';

/* eslint-disable import/no-anonymous-default-export */
export default ({
  workBenchUseStore,
}) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => ({
      url: 'iam/choerodon/v1/workbench_configs/self',
      method: 'get',
      transformResponse: (value) => {
        try {
          let res;
          if (value) {
            const tempData = get(JsonBig.parse(value), 'data');
            res = tempData ? map(JsonBig.parse(tempData), (item) => item.layout) : [];
          } else {
            const defaultValues = map(filter(mappings, (item) => item.type !== 'backlogApprove'), (item) => item.layout);
            res = defaultValues;
          }
          workBenchUseStore.setInitData(res);
          return res;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  },
});
