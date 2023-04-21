export const defaultColumnSetConfig = [
  {
    name: 'name',
    label: '项目',
    isSelected: true,
    order: -1,
  },
  {
    name: 'code',
    label: '项目编码',
    isSelected: true,
    order: 0,
  },
  {
    name: 'enabled',
    label: '项目状态',
    isSelected: true,
    order: 1,
  },
  {
    name: 'workGroup',
    label: '工作组',
    isSelected: true,
    order: 3,
  },
  {
    name: 'projectClassfication',
    label: '项目分类',
    isSelected: true,
    order: 4,
  },
  {
    name: 'programName',
    label: '所属项目群',
    isSelected: true,
    order: 5,
  },
  {
    name: 'categories',
    label: '项目类型',
    isSelected: true,
    order: 6,
  },
  {
    name: 'description',
    label: '项目描述',
    isSelected: true,
    order: 7,
  },
  {
    name: 'devopsComponentCode',
    label: 'DevOps组件编码',
    isSelected: false,
    order: 8,
  },
  {
    name: 'createUserName',
    label: '创建人',
    isSelected: false,
    order: 9,
  },
  {
    name: 'creationDate',
    label: '创建时间',
    isSelected: false,
    order: 10,
    width: 155,
  },
  {
    name: 'updateUserName',
    label: '更新人',
    isSelected: false,
    order: 11,
  },
  {
    name: 'lastUpdateDate',
    label: '更新时间',
    isSelected: false,
    order: 12,
    width: 155,
  },
];
export const defaultBusinessColumnSetConfig = [
  ...defaultColumnSetConfig,
  {
    name: 'rank',
    label: '健康状态',
    isSelected: true,
    order: 2,
    width: 155,
  },
];
