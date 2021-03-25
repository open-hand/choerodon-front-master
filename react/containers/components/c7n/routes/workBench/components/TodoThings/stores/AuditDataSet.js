/* eslint-disable import/no-anonymous-default-export */

export default (({ organizationId, selectedProjectId, cacheStore }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/approval${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
    },
  },
}));
