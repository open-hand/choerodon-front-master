const HAS_AGILE_PRO = C7NHasModule('@choerodon/agile-pro');
const PROJECT_TYPE = HAS_AGILE_PRO ? {
  GENERAL: 'DevOps全流程项目',
  // LOWCODE: '低代码应用项目',
  AGILE: '普通敏捷项目',
  PROGRAM: '敏捷项目群项目',
} : {
  GENERAL: 'DevOps全流程项目',
};

export { PROJECT_TYPE, HAS_AGILE_PRO };
