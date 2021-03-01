/* eslint-disable import/no-anonymous-default-export */

export default (({ selectedProjectId, organizationId }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/latest_app_service${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
    },
  },
  fields: [],
}));
