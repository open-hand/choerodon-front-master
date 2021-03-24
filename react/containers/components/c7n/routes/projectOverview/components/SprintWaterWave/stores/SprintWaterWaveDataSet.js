/* eslint-disable import/no-anonymous-default-export */
export default (({ projectId, sprint }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url: `/agile/v1/projects/${projectId}/project_overview/${sprint ? sprint.sprintId : ''}/uncompleted`,
      method: 'get',
    },
  },
}));
