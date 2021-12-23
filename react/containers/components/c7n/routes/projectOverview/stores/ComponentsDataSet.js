import {
  map, get, filter, includes,
} from 'lodash';
import JsonBig from 'json-bigint';
import mappings from './mappings';

const HAS_AGILEPRO = C7NHasModule('@choerodon/agile-pro');

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, availableServiceList, projectOverviewStore }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => ({
      url: `iam/choerodon/v1/projects/${projectId}/project_overview_config`,
      method: 'get',
      transformResponse: (value) => {
        const defaultValues = map(filter(mappings, (item) => {
          if (!HAS_AGILEPRO) {
            return item.injectGroupId !== 'agilePro';
          }
          return (includes(availableServiceList, 'agilePro') ? includes(availableServiceList, item.groupId)
            || (item.injectGroupId && includes(availableServiceList, item.injectGroupId)) : true);
        }), (item) => item.layout);
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
