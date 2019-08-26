import queryString from 'query-string';

export default (AppState, history) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  primaryKey: 'code',
  transport: {
    read: {
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/applications/user/permission?as_template=false`,
      method: 'get',
    },
    submit: ({ dataSet }) => ({
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/applications/${dataSet.current.get('id')}`,
      method: 'put',
      data: dataSet.current.toData(),
    }),
  },
  fields: [
    { name: 'name', type: 'string', label: '应用名称', required: true },
    { name: 'code', type: 'string', label: '编码', required: true },
    { name: 'type', type: 'string', label: '应用来源' },
    { name: 'connect', type: 'string', label: '关联项目' },
    { name: 'creationDate', type: 'date', label: '创建时间' },
  ],
});
