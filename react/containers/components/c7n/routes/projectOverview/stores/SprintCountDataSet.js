import axios from 'axios';
export default (({ projectId, sprint }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  dataKey: null,
  // axios: axios.create({
  //   baseURL: 'http://10.211.146.21:8080',
  //   headers: { 'Jwt_Token': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIiLCJ1c2VyVHlwZSI6IlAiLCJhdXRob3JpdGllcyI6W10sImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJhY2NvdW50Tm9uTG9ja2VkIjp0cnVlLCJjcmVkZW50aWFsc05vbkV4cGlyZWQiOnRydWUsImVuYWJsZWQiOnRydWUsInVzZXJJZCI6MSwicmVhbE5hbWUiOm51bGwsImVtYWlsIjoiaGFuZEBoYW5kLWNoaW5hLmNvbSIsInRpbWVab25lIjoiQ1RUIiwibGFuZ3VhZ2UiOiJ6aF9DTiIsInJvbGVJZCI6MjM4OCwicm9sZUlkcyI6bnVsbCwic2l0ZVJvbGVJZHMiOlsyMzg4XSwidGVuYW50Um9sZUlkcyI6WzIzODldLCJyb2xlTWVyZ2VGbGFnIjp0cnVlLCJ0ZW5hbnRJZCI6MCwidGVuYW50TnVtIjpudWxsLCJ0ZW5hbnRJZHMiOm51bGwsImltYWdlVXJsIjpudWxsLCJvcmdhbml6YXRpb25JZCI6MCwiY2xpZW50SWQiOm51bGwsImNsaWVudE5hbWUiOm51bGwsImNsaWVudEF1dGhvcml6ZWRHcmFudFR5cGVzIjpudWxsLCJjbGllbnRSZXNvdXJjZUlkcyI6bnVsbCwiY2xpZW50U2NvcGUiOm51bGwsImNsaWVudFJlZ2lzdGVyZWRSZWRpcmVjdFVyaSI6bnVsbCwiY2xpZW50QWNjZXNzVG9rZW5WYWxpZGl0eVNlY29uZHMiOm51bGwsImNsaWVudFJlZnJlc2hUb2tlblZhbGlkaXR5U2Vjb25kcyI6bnVsbCwiY2xpZW50QXV0b0FwcHJvdmVTY29wZXMiOm51bGwsImFkZGl0aW9uSW5mbyI6bnVsbCwiYWRkaXRpb25JbmZvTWVhbmluZyI6bnVsbCwiYWRtaW4iOm51bGx9.1NF2FkMk89eWXgtL1XKsMLv22aYmMYsB9vjr8JIER5g' }
  // }),
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
