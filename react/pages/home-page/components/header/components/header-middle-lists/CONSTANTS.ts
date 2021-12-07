import { HOMEPAGE_PATH } from '@/constants';

const WORKBENCH_CONFIG = { title: 'workbench', path: HOMEPAGE_PATH };

const WORKCALENDAR_CONFIG = { title: 'workCalendar', path: '/agile/work-calendar' };

const KNOWLEDGE_CONFIG = {
  title: 'knowledge',
  path: '/knowledge/organization',
  style: { marginLeft: 4 },
  permissions: [
    'choerodon.code.organization.knowledge.ps.default',
    'choerodon.code.organization.knowledge.ps.recycle',
  ],
};

const MARKET_CONFIG = {
  title: 'market',
  path: '/market/app-market',
  style: { marginLeft: 2 },
};

export {
  KNOWLEDGE_CONFIG,
  MARKET_CONFIG,
  WORKBENCH_CONFIG,
  WORKCALENDAR_CONFIG,
};
