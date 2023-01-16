/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';

export default (({ organizationId, selectedProjectId, cacheStore }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/approval${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse: (data) => {
        try {
          const res = JSONbig.parse(data);
          return res;
        } catch (e) {
          return data;
        }
      },
    },
  },
}));
