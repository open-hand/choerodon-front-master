import queryString from 'query-string';

export default (AppState, history, applicationId) => ({
  autoQuery: true,
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
    { name: 'name', type: 'string', label: '服务名称' },
    { name: 'code', type: 'string', label: '编码' },
    { name: 'type', type: 'string', label: '类型' },
    { name: 'status', type: 'string', label: '状态' },
  ],
});
