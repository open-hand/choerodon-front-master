/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, mainStore }) => ({
  autoQuery: true,
  selection: false,
  pageSize: 8,
  transport: {
    read: ({ dataSet }) => ({
      url: `/iam/choerodon/v1/projects/${projectId}/user_count`,
      method: 'get',
      transformResponse: (response) => {
        try {
          const res = JSON.parse(response);
          if (res && res.failed) {
            return res;
          }
          if (res?.totalOnlineUser) {
            mainStore.setTotalUser(res.totalOnlineUser);
          }
          return res.onlineUserList;
        } catch (e) {
          return response;
        }
      },
    }),
  },
  fields: [
    { name: 'realName', type: 'string' },
    { name: 'loginName', type: 'string' },
  ],
});
