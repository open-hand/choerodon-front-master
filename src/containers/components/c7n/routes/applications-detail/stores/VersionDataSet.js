export default (AppState, history, applicationId, projectId) => ({
  autoQuery: false,
  selection: false,
  paging: true,
  pageSize: 10,
  transport: {
    read: {
      url: `/base/v1/projects/${projectId}/applications/versions/${applicationId}`,
      method: 'get',
    },
    submit: ({ dataSet }) => ({
      url: `/base/v1/projects/${projectId}/applications/versions`,
      method: 'post',
      data: dataSet.current.toData(),
    }),
  },
  fields: [
    { name: 'name', type: 'string', label: '版本名称', required: true },
    { name: 'status', type: 'string', label: '状态' },
    { name: 'startTime', type: 'date', label: '开始日期', max: 'publishTime' },
    { name: 'publishTime', type: 'date', label: '发布日期', min: 'startTime' },
    { name: 'description', type: 'string', label: '描述' },
  ],
});
