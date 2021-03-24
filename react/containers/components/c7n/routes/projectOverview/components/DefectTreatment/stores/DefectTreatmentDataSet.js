import { get } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord }) => ({
  paging: false,
  autoQuery: true,
  transport: {
    read: ({ data }) => (startedRecord ? {
      method: 'get',
      url: `/agile/v1/projects/${projectId}/project_overview/${get(startedRecord, 'sprintId')}/issue`,
    } : {}),
  },
});
