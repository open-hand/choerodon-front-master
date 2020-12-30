/* eslint-disable import/no-anonymous-default-export */
export default (({ organizationId, selectedProjectId, self }) => ({
  autoQuery: true,
  selection: false,
  paging: true,
  dataKey: null,
  pageSize: 6,
  transport: {
    read: ({ params }) => ({
      url: `/knowledge/v1/organizations/${organizationId}/work_space/recent_project_update_list${self ? '/self' : ''}`,
      method: 'get',
      params: {
        ...params,
        projectId: selectedProjectId ? String(selectedProjectId) : undefined,
      },
    }),
  },
  fields: [],
}));
