export default (({ organizationId }) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: {
      url: `agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues`,
      method: 'post',
    },
  },
  // fields: [],
}));
