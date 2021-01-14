import { get } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord }) => ({
  paging: false,
  autoQuery: false,
  transport: {
    read: ({ data }) => ({
      method: 'get',
      url: `/agile/v1/projects/${projectId}/project_overview/${get(startedRecord, 'sprintId')}/issue`,
    }),
  },
});
