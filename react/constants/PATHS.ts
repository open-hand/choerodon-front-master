// 把路由地址只要是参数配置的都写在这里

// 主页面，当前是工作台，后续可配置成环境变量
const HOMEPAGE_PATH = '/workbench' as const;

// 所有项目页面
const PROJECTS_HOME_PATH = '/projects' as const;

// 不晓得这啥页面
const APPLICATIONS_PATH = '/applications' as const;

// 应用市场页面
const MARKET_PATH = '/market/app-market' as const;

// 知识库页面
const KNOWLEDGE_ORG_PATH = '/knowledge/organization' as const;

// 组织层知识库模板预览页面
const KNOWLEDGE_ORG_TEMPLATE_PREVIEW_PATH = '/knowledge/organization/template/preview' as const;

// 项目层知识库模板预览页面
const KNOWLEDGE_PROJECT_TEMPLATE_PREVIEW_PATH = '/knowledge/project/template/preview' as const;

// 这也是敏捷那边的不晓得啥
const ENTERPRISE_ADDRESS = '/base/enterprise' as const;

// 敏捷工作日历页面
const AGILE_WORK_CALENDAR_PATH = '/agile/work-calendar'as const;

// 用户信息路由
const USERINFO_PATH = '/base/user-info';

// const defaultBlackList = ['/projects', '/applications', '/knowledge/organization', '/workbench', '/market/app-market', '/iam/enterprise', '/agile/work-calendar'];

export {
  HOMEPAGE_PATH,
  APPLICATIONS_PATH,
  MARKET_PATH,
  KNOWLEDGE_ORG_PATH,
  ENTERPRISE_ADDRESS,
  PROJECTS_HOME_PATH,
  AGILE_WORK_CALENDAR_PATH,
  USERINFO_PATH,
  KNOWLEDGE_ORG_TEMPLATE_PREVIEW_PATH,
  KNOWLEDGE_PROJECT_TEMPLATE_PREVIEW_PATH,
};
