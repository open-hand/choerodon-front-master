export default ({ projectId }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/projects/${projectId}/overview/commit_count`,
      method: 'get',
    },
  },
});
