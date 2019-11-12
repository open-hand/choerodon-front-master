import queryString from 'query-string';

export default (applicationId, history) => ({
  autoQuery: true,
  paging: false,
  selection: false,
  transport: {
    read: {
      url: `/base/v1/organizations/${queryString.parse(history.location.search).organizationId}/applications/${applicationId}/services/list`,
      method: 'get',
    },
  },
  fields: [
    { name: 'name', type: 'string', label: '应用服务名称' },
    { name: 'code', type: 'string', label: '应用服务编码' },
    { name: 'type', type: 'string', label: '应用服务类型' },
  ],
});
