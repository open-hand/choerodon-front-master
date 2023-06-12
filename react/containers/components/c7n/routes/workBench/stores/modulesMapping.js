const modulesMapping = {
  common: ['starTarget', 'selfInfo', 'quickLink', 'doc', 'beginnerGuide', 'notice'],
  devops: [
    'todoThings',
    'serviceList',
    'envList',
    'selfCode',
    'resourceOverview',
    'resourceMonitoring',
    'projectQualityScore',
    'userQualityScore',
  ],
  agile: [
    'todoQustions', 'myStar', 'myDefect', 'myReport', 'myExecution', 'myhandler', 'userIssue', 'projectProgress',
    // 二开的组件，原版后端不会有 这里不用做判断
    'projectVersionProgress', 'teamLeaderOrder', 'developerRank',
  ],
  backlog: [
    'backlogApprove',
  ],
};

export default modulesMapping;
