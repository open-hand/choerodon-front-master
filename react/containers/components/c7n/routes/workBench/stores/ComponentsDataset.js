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
        const defaultValues = map(mappings, (item) => item);
        try {
          let res;
          if (value) {
            const tempData = get(JsonBig.parse(value), 'data');
            res = tempData ? JsonBig.parse(tempData) : [];
          } else {
            res = defaultValues;
          }
          return res;
        } catch (error) {
          return defaultValues;
        }
      },
    }),
  },
  events: {
    // load: ({ dataSet }) => {
    //   const tempData = map(dataSet.toData(), (item) => {
    //     if (item.type === 'starTarget') {
    //       return item;
    //     }
    //     const tempItem = item;
    //     tempItem.layout.static = false;
    //     return tempItem;
    //   });
    //   workBenchUseStore.setComponents(tempData);
    // },
  },
});
