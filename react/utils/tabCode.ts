const TabCodeMap = new Map([
  ['/testManager/IssueManage', {
    name: '用例库',
    tabCodes: ['test-case', 'api-test-case'],
  }],
  ['/devops/code-management', {
    name: '代码管理',
    tabCodes: ['branch', 'merge_request', 'pipeline', 'tag', 'code-quality'],
  }]
]);

export default TabCodeMap;
