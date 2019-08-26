export default (AppState, history, applicationId, projectId) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/base/v1/projects/${projectId}/applications/versions/${applicationId}`,
      // url: `/base/v1/projects/490/applications/versions/490`,
      method: 'get',
    },
    submit: ({ dataSet }) => ({
      url: `/base/v1/projects/${projectId}/applications/versions`,
      method: 'post',
      data: {
        ...dataSet.current.toData(),
        applicationId,
      },
    }),
  },
  fields: [
    { name: 'name', type: 'string', label: '版本名称', required: true },
    { name: 'statusCode', type: 'string', label: '状态' },
    { name: 'startDate', type: 'date', label: '开始日期', max: 'releaseDate' },
    { name: 'releaseDate', type: 'date', label: '发布日期', min: 'startDate' },
    { name: 'description', type: 'string', label: '描述' },
  ],
});
