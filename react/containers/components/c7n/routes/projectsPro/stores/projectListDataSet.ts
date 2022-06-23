export default (({ organizationId, userId }:{organizationId:string, userId:string}) => ({
  autoQuery: true,
  autoCreate: true,
  selection: false as any,
  transport: {
    read: ({ dataSet, params, data }:any) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/users/${userId}/projects/paging`,
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
  ],
}));
