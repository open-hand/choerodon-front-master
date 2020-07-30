export default (({ organizationId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/approval`,
      method: 'get',
    },
  },
  // fields: [],
}));
