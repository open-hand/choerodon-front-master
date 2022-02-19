export default ({
  organizationId, projectId,
}) => ({
  autoCreate: false,
  autoQuery: false,
  transport: {
    read: {
      url: `/iam/choerodon/v1/organizations/${organizationId}/project_status/projects/${projectId}/list`,
      method: 'get',
    },
  },
});
