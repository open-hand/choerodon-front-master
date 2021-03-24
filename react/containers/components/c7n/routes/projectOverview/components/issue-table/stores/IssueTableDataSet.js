import { get } from 'lodash';

/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord, organizationId }) => ({
  primaryKey: 'issueId',
  paging: true,
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'summary', type: 'string', label: '概要' },
    { name: 'typeCode', type: 'object', label: '问题类型' },
    { name: 'issueNum', type: 'string', label: '问题编号' },
    { name: 'priority', label: '优先级' },
    { name: 'status', label: '状态' },
    { name: 'storyPoints', type: 'string', label: '故事点' },
    { name: 'remainingTime', type: 'string', label: '剩余预估时间' },
  ],
  transport: {
    read: ({ data, params }) => ({
      method: 'get',
      url: `/agile/v1/projects/${projectId}/sprint/${get(startedRecord, 'sprintId')}/issues`,
      params: {
        organizationId,
        status: 'done',
        ...params,

      },

    }),
  },
});
