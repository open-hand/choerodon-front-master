export default (({ projectId, sprint }) => ({
    autoQuery: false,
    selection: false,
    paging: false,
    dataKey: null,
    transport: {
      read: { 
        url: `/agile/v1/projects/${projectId}/project_overview/${sprint ? sprint.sprintId : ''}/uncompleted`,
        method: 'get',
      },
    },
    // fields: [],
  }));
  