export default (({ organizationId, projectId, self = false }) => ({
  autoQuery: false,
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
        projectId: projectId ? String(projectId) : undefined,
      },
    }),
  },
  fields: [],
}));
