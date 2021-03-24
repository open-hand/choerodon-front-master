import { get } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => ({
      method: 'get',
      url: `/agile/v1/projects/${projectId}/iterative_worktable/assignee_id`,
      params: {
        sprintId: get(startedRecord, 'sprintId'),
      },

    }),
  },
});
