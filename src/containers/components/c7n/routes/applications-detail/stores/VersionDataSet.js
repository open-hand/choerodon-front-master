import queryString from 'query-string';

export default (AppState, history, applicationId) => ({
  autoQuery: false,
  selection: false,
  paging: true,
  pageSize: 10,
  transport: {
    read: {
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/applications/${applicationId}/services`,
      method: 'get',
    },
    submit: ({ dataSet }) => ({
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/projects/${dataSet.current.get('id')}`,
      method: 'put',
      data: dataSet.current.toData(),
    }),
  },
  fields: [
    { name: 'name', type: 'string', label: '版本名称' },
    { name: 'status', type: 'string', label: '状态' },
    { name: 'startTime', type: 'date', label: '开始日期' },
    { name: 'publishTime', type: 'date', label: '发布日期' },
    { name: 'description', type: 'string', label: '描述' },
  ],
});
