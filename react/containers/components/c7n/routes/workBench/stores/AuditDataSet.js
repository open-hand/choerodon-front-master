export default (({ organizationId }) => ({
  autoQuery: true,
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
