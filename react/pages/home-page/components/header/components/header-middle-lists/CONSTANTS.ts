const WORKBENCH_CONFIG = { title: '工作台', path: '/workbench' };

const WORKCALENDAR_CONFIG = { title: '工作日历', path: '/agile/work-calendar' };

const KNOWLEDGE_CONFIG = {
  title: '知识库',
  path: '/knowledge/organization',
  style: { marginLeft: 4 },
  permissions: [
    'choerodon.code.organization.knowledge.ps.default',
    'choerodon.code.organization.knowledge.ps.recycle',
  ],
};

const MARKET_CONFIG = {
  title: '应用市场',
  path: '/market/app-market',
  style: { marginLeft: 2 },
};

export {
  KNOWLEDGE_CONFIG,
  MARKET_CONFIG,
  WORKBENCH_CONFIG,
  WORKCALENDAR_CONFIG,
};
