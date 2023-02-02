export default (({ organizationId, userId }:{organizationId:string, userId:string}) => ({
  autoQuery: true,
  autoCreate: true,
  selection: false as any,
  transport: {
    read: ({ dataSet, params, data }:any) => ({
      url: `/cbase/choerodon/v1/organizations/${organizationId}/users/${userId}/projects/paging`,
      method: 'post',
    }),
  },
  fields: [
    {
      name: 'name',
      label: '项目',
    },
    {
      name: 'code',
      label: '项目编码',
    },
    {
      name: 'enabled',
      label: '项目状态',
      type: 'boolean',
    },
    {
      name: 'rank',
      label: '健康状态',
    },
    {
      name: 'workGroup',
      label: '工作组',
    },
    {
      name: 'projectClassfication',
      label: '项目分类',
    },
    {
      name: 'programName',
      label: '所属项目群',
    },
    {
      name: 'categories',
      label: '项目类型',
    },
    {
      name: 'description',
      label: '项目描述',
    },
    {
      name: 'devopsComponentCode',
      label: 'DevOps组件编码',
    },
    {
      name: 'createUserName',
      label: '创建人',
    },
    {
      name: 'creationDate',
      label: '创建时间',
    },
    {
      name: 'updateUserName',
      label: '更新人',
    },
    {
      name: 'lastUpdateDate',
      label: '更新时间',
    },
  ],
}));
