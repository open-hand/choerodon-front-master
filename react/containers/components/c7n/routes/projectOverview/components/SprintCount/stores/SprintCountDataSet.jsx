/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import C7NFormat from '@/components/c7n-formatMessage';

export default (({ projectId, sprint }) => ({
  autoQuery: true,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: sprint ? {
      url: `/agile/v1/projects/${projectId}/project_overview/${sprint ? sprint.sprintId : ''}/sprint_statistics`,
      method: 'get',
    } : {},
  },
  fields: [
    {
      name: 'completedCount',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="complete"
      />,
    },
    {
      name: 'uncompletedCount',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="incomplete"
      />,
    },
    {
      name: 'todoCount',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="pending"
      />,
    },
    {
      name: 'unassignCount',
      label: <C7NFormat
        intlPrefix="agile.projectOverview"
        id="unassigned"
      />,
    },
  ],
}));
