/* eslint-disable import/no-anonymous-default-export */

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
    { name: 'completedCount', label: '已完成' },
    { name: 'uncompletedCount', label: '未完成' },
    { name: 'todoCount', label: '待处理' },
    { name: 'unassignCount', label: '未分配' },
  ],
}));
