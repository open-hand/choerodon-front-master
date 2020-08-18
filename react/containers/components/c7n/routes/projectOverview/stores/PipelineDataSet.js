export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/projects/${projectId}/overview/ci_count`,
      method: 'get',
    },
  },
});
