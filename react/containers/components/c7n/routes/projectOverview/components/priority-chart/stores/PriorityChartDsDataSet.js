import { get } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord, organizationId }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => ({
      method: 'get',
      url: `/agile/v1/projects/${projectId}/iterative_worktable/priority`,
      params: {
        organizationId,
        sprintId: get(startedRecord, 'sprintId'),
      },

    }),
  },
});
