export default (organizationId) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: organizationId ? `iam/v1/organizations/${organizationId}/project_categories` : '',
      method: 'get',
    },
  },
});
