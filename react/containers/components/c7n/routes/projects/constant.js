const HAS_AGILE_PRO = C7NHasModule('@choerodon/agile-pro');
const PROJECT_TYPE = HAS_AGILE_PRO ? {
  GENERAL: '普通应用项目',
  // LOWCODE: '低代码应用项目',
  // AGILE: '敏捷管理项目',
  PROGRAM: '敏捷项目群项目',
} : {
  GENERAL: '普通应用项目',
};

export { PROJECT_TYPE, HAS_AGILE_PRO };
