import queryString from 'query-string';

export default (AppState, history) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'code',
  expandField: 'expandField',
  transport: {
    read: {
      url: `/iam/choerodon/v1/organizations/${queryString.parse(history.location.search).organizationId}/applications/pagingByOptions`,
      method: 'get',
    },
  },
  fields: [
    { name: 'name', type: 'string', label: '应用名称', required: true },
    { name: 'code', type: 'string', label: '编码', required: true },
    { name: 'description', type: 'string', label: '描述' },
    { name: 'type', type: 'string', label: '应用来源' },
    { name: 'imageUrl', type: 'string' },
    { name: 'projectId', type: 'number' },
    { name: 'projectName', type: 'string', label: '关联项目' },
    { name: 'creationDate', type: 'date', label: '创建时间', format: 'YYYY-MM-DD' },
    { name: 'creatorRealName', type: 'string', label: '创建者' },
    { name: 'expandField', type: 'boolean' },
  ],
  queryFields: [
    { name: 'name', type: 'string', label: '应用名称' },
    { name: 'description', type: 'string', label: '描述' },
    { name: 'projectName', type: 'string', label: '关联项目' },
    { name: 'creatorRealName', type: 'string', label: '创建者' },
  ],
});
