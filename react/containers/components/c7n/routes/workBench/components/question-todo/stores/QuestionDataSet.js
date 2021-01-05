import JSONbig from 'json-bigint';

export default (({ organizationId, questionStore }) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => {
      const { selectedProjectId } = data || {};
      return ({
        url: `agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${questionStore.getPage || 1}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
        method: 'post',
        transformResponse(response) {
          try {
            const res = JSONbig.parse(response);
            if (res && res.failed) {
              return res;
            }
            questionStore.setTotalCount(res.totalElements);
            questionStore.setHasMore(res.totalElements && (res.number + 1) < res.totalPages);
            return res.content;
          } catch (e) {
            return response;
          }
        },
      });
    },
  },
  events: {
    load: ({ dataSet }) => {
      const records = questionStore.getQuestionData;
      if (questionStore.getPage > 1) {
        dataSet.unshift(...records);
      }
      questionStore.setQuestionData(dataSet.records);
    },
  },
}));
