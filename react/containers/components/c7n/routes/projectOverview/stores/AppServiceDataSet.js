export default ({ projectId }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/projects/${projectId}/overview/app_service`,
      method: 'get',
    },
  },
});
