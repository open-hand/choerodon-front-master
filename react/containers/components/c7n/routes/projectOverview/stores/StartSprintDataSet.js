/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';

export default (({ projectId, loadStartedSprintBlock }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url: `/agile/v1/projects/${projectId}/sprint/names`,
      method: 'post',
      data: ['started', 'closed'],
      transformResponse: (value) => {
        try {
          const res = JSONbig.parse(value);
          if (res && res.failed) {
            return res;
          }
          const mainData = res.find((sprint) => sprint.statusCode === 'started');
          return mainData;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
  events: {
    load: ({ dataSet }) => {
      if (dataSet.length) {
        loadStartedSprintBlock();
      }
    },
  },
}));
