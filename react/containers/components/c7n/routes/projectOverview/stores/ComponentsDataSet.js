import { map, get } from 'lodash';
import JsonBig from 'json-bigint';
import mappings from './mappings';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, projectOverviewStore }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => ({
      url: `iam/choerodon/v1/projects/${projectId}/project_overview_config`,
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
          projectOverviewStore.setInitData(res);
          projectOverviewStore.setEditLayout(res);

          const tempQueryComponents = map(res, (item) => get(item, 'i'));
          projectOverviewStore.setQueryComponents(tempQueryComponents);
          return res;
        } catch (error) {
          return defaultValues;
        }
      },
    }),
  },
});
