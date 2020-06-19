export default (({ organizationId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `devops/v1/desktop/${organizationId}/approval`,
      method: 'get',
    },
  },
  // fields: [],
}));
