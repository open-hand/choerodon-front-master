export default ({ projectId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `/devops/v1/projects/${projectId}/overview/commit_count`,
      method: 'get',
      // transformResponse: (response) => {
      //   try {
      //     const res = JSON.parse(response);
      //     if (res && res.failed) {
      //       return data;
      //     } else {
      //       const newDate = [];
      //       const newFailureCount = [];
      //       const newPercentage = [];
      //       const newTotalCount = [];
      //       res.forEach(({ creationDate, failureCount, percentage, totalCount }) => {
      //         newDate.push(creationDate.split(' ')[0]);
      //         newFailureCount.push(failureCount);
      //         newPercentage.push(percentage);
      //         newTotalCount.push(totalCount);
      //       });
      //       return ({
      //         date: newDate,
      //         failureCount: newFailureCount,
      //         percentage: newPercentage,
      //         totalCount: newTotalCount,
      //       });
      //     }
      //   } catch (e) {
      //     return response;
      //   }
      // },
    },
  },
});
