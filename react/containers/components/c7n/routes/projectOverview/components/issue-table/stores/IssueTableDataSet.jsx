import { get } from 'lodash';
import React from 'react';

import C7NFormat from '@/components/c7n-formatMessage';
/* eslint-disable import/no-anonymous-default-export */
export default ({ projectId, startedRecord, organizationId }) => ({
  primaryKey: 'issueId',
  paging: true,
  autoQuery: true,
  selection: false,
  fields: [
    {
      name: 'summary',
      type: 'string',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="summary"
      />,
    },
    {
      name: 'typeCode',
      type: 'object',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="issueType"
      />,
    },
    {
      name: 'issueNum',
      type: 'string',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="number"
      />,
    },
    {
      name: 'priority',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="priority"
      />,
    },
    {
      name: 'status',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="status"
      />,
    },
    {
      name: 'storyPoints',
      type: 'string',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="storyPoints"
      />,
    },
    {
      name: 'remainingTime',
      type: 'string',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="remain.estimate"
      />,
    },
  ],
  transport: {
    read: ({ data, params }) => (startedRecord ? {
      method: 'get',
      url: `/agile/v1/projects/${projectId}/sprint/${get(startedRecord, 'sprintId')}/issues`,
      params: {
        organizationId,
        status: 'done',
        ...params,

      },

    } : {}),
  },
});
