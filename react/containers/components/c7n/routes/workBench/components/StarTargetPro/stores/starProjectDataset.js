/* eslint-disable import/no-anonymous-default-export */
export default ({ organizationId }) => ({
  paging: false,
  autoQuery: false,
  pageSize: 6,
  transport: {
    read: ({ data, dataSet }) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/star_projects`,
      method: 'get',
    }),
  },
});
