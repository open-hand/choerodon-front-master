/* eslint-disable import/no-anonymous-default-export */
import JsonBig from 'json-bigint';

export default (({ selectedProjectId, cacheStore, organizationId }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/organizations/${organizationId}/work_bench/latest_commit${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
    },
  },
  fields: [],
}));
