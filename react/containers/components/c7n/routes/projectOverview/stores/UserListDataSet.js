export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  transport: {
    read: {
      url: `/iam/choerodon/v1/projects/${projectId}/users/search`,
      method: 'get',
    },
  },
  fields: [
    { name: 'realName', type: 'string' },
    { name: 'loginName', type: 'string' },
  ],
});
