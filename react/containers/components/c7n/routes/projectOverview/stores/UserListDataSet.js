export default ({ projectId }) => ({
  autoQuery: true,
  selection: false,
  transport: {
    read: {
      url: `/iam/choerodon/v1/projects/${projectId}/users/user_count`,
      method: 'get',
    },
  },
  fields: [
    { name: 'realName', type: 'string' },
    { name: 'loginName', type: 'string' },
  ],
});
