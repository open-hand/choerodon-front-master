import {
  map, get, filter, includes,
} from 'lodash';
import JsonBig from 'json-bigint';
import mappings from './mappings';
import { getInitProjectOverviewLayout } from './utils';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, availableServiceList, projectOverviewStore }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => ({
      url: `cbase/choerodon/v1/projects/${projectId}/project_overview_config`,
      method: 'get',
      transformResponse: (value) => {
        const defaultValues = getInitProjectOverviewLayout(availableServiceList);
        try {
          let res;
          if (value) {
            const tempData = get(JsonBig.parse(value), 'data');
            res = tempData ? map(JsonBig.parse(tempData), (item) => item.layout) : [];
          } else {
            res = defaultValues;
          }
          projectOverviewStore.setInitData(res);
          return res;
        } catch (error) {
          return defaultValues;
        }
      },
    }),
  },
});
