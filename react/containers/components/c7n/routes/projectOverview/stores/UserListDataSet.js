/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  pageSize: 8,
  transport: {
    read: {
      url: `/iam/choerodon/v1/projects/${projectId}/user_count`,
      method: 'get',
      transformResponse: (response) => {
        try {
          const res = JSON.parse(response);
          if (res && res.failed) {
            return res;
          }
          return res.onlineUserList;
        } catch (e) {
          return response;
        }
      },
    },
  },
  fields: [
    { name: 'realName', type: 'string' },
    { name: 'loginName', type: 'string' },
  ],
});
