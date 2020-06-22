import queryString from 'query-string';

export default (AppState, history) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: queryString.parse(history.location.search).organizationId ? `iam/v1/organizations/${queryString.parse(history.location.search).organizationId}/project_categories` : '',
      method: 'get',
    },
  },
});
