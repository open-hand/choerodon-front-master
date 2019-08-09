import queryString from 'query-string';

export default (AppState, history) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/base/v1/organizations/${queryString.parse(history.location.search).orgId}/users/${AppState.getUserId}/enableProjects`,
      method: 'get',
    },
  },
  fields: [
    { name: 'name', type: 'string', label: '项目名称', required: true },
    { name: 'appCode', type: 'string', label: '应用编码', required: true },
    { name: 'appName', type: 'string', label: '应用名称', defaultValue: '默认应用名称', required: true },
    { name: 'code', type: 'string', label: '项目编码', required: true },
    { name: 'category', type: 'string', label: '项目类型', required: true, defaultValue: 'AGILE' },
    { name: 'categoryGroup', type: 'string', label: '项目群' },
    { name: 'createBy', type: 'string', label: '创建人' },
    { name: 'creationDate', type: 'date', label: '创建时间' },
    { name: 'createType', type: 'string' },
    { name: 'createByApp', type: 'string' },
  ],
});
