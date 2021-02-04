import JsonBig from 'json-bigint';
/* eslint-disable import/no-anonymous-default-export */
export default ({ organizationId, cacheStore }) => ({
  paging: false,
  autoQuery: false,
  pageSize: 6,
  transport: {
    read: ({ data, dataSet }) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/star_projects`,
      method: 'get',
      transformResponse: (value) => {
        try {
          const temp = JsonBig.parse(value);
          if (temp && temp.failed) {
            return temp;
          }
          const tempObj = {
            content: temp,
            organizationId,
          };
          cacheStore.setStartProjects(tempObj);
          return temp;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  },
});
