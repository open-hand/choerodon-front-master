export default ({
  organizationId, projectId,
}) => ({
  autoCreate: false,
  autoQuery: true,
  transport: {
    read: {
      url: `/cbase/choerodon/v1/organizations/${organizationId}/project_template/paging`,
      method: 'get',
    },
  },
});
