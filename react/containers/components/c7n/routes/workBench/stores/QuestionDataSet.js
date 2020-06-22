export default (({ organizationId }) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => {
      const { projectId, page = 0 } = data || {};
      return ({
        url: `agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${page}&size=20${projectId ? `projectId=${projectId}` : ''}`,
        method: 'post',
      });
    },
  },
  // fields: [],
}));
