export default (({ organizationId, userId }:{organizationId:string, userId:string}) => ({
  autoQuery: true,
  autoCreate: true,
  selection: false as any,
  transport: {
    read: ({ dataSet }:any) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/users/${userId}/projects/paging`,
      method: 'post',
    }),
  },
  fields: [
    {
      name: 'name',
      label: '项目',
    },
  ],
}));
