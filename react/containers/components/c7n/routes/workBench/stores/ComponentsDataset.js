import { map, get } from 'lodash';
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
        const defaultValues = map(mappings, (item) => item.layout);
        try {
          let res;
          if (value) {
            const tempData = get(JsonBig.parse(value), 'data');
            res = tempData ? map(JsonBig.parse(tempData), (item) => item.layout) : [];
          } else {
            res = defaultValues;
          }
          workBenchUseStore.setInitData(res);
          workBenchUseStore.setEditLayout(res);

          return res;
        } catch (error) {
          return defaultValues;
        }
      },
    }),
  },
});
