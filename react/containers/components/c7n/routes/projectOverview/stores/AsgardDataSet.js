/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: ({ data }) => {
      const { date = 7 } = data || {};
      return ({
        url: `/hagd/v1/sagas/projects/${projectId}/instances/statistics/failure?date=${date}`,
        method: 'get',
        transformResponse: (response) => {
          try {
            const res = JSON.parse(response);
            if (res && res.failed) {
              return res;
            }
            const newDate = [];
            const newFailureCount = [];
            const newPercentage = [];
            const newTotalCount = [];
            res.forEach(({
              creationDate, failureCount, percentage, totalCount,
            }) => {
              newDate.push(creationDate.split(' ')[0]);
              newFailureCount.push(failureCount);
              newPercentage.push(percentage);
              newTotalCount.push(totalCount);
            });
            return ({
              date: newDate,
              failureCount: newFailureCount,
              percentage: newPercentage,
              totalCount: newTotalCount,
            });
          } catch (e) {
            return response;
          }
        },
      });
    },
  },
});
