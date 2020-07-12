export default ({ projectId, projectOverviewStore }) => ({
  autoQuery: true,
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
          } else {
            projectOverviewStore.setTotalOnlineUser(res.totalOnlineUser || 0);
            return res.onlineUserList;
          }
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
