export default (({ organizationId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/latest_app_service`,
      method: 'get',
    },
  },
  fields: [],
}));
