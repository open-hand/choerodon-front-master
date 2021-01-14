/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/projects/${projectId}/overview/app_service`,
      method: 'get',
    },
  },
});
