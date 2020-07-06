import axios from 'axios';
export default (({ projectId, sprint }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  dataKey: null,
  // data: [{
  //   "total": 51,
  //   "completedCount": 50,
  //   "uncompletedCount": 1,
  //   "todoCount": 1,
  //   "unassignCount": 0
  // }],
  transport: {
    read: {
      url: `/agile/v1/projects/${projectId}/project_overview/${sprint ? sprint.sprintId : ''}/sprint_statistics`,
      method: 'get',
    },
  },
  fields: [
    // { name: 'total', label: '问题总数' },
    { name: 'completedCount', label: '已完成' },
    { name: 'uncompletedCount', label: '未完成' },
    { name: 'todoCount', label: '待处理' },
    { name: 'unassignCount', label: '未分配' }
  ],
}));
