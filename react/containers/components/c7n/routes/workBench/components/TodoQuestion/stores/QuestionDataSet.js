/* eslint-disable import/no-anonymous-default-export */
export default (({ selectedProjectId, organizationId }) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => {
      const { page = 0 } = data || {};
      return ({
        url: `agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${page}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
        method: 'post',
      });
    },
  },
}));
