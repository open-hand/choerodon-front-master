import JsonBig from 'json-bigint';
/* eslint-disable import/no-anonymous-default-export */
export default ({ organizationId, cacheStore }) => ({
  paging: false,
  autoQuery: true,
  pageSize: 6,
  transport: {
    read: ({ data, dataSet }) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/star_projects`,
      method: 'get',
      enabledCancelCache: false,
    }),
  },
});
