export default (({
  organizationId, userId, func, formatProject,
}:{organizationId:string, userId:string, func: any, formatProject: any}) => {
  let extraFields = [];
  if (func) {
    extraFields = func.default();
  }
  return ({
    autoQuery: false,
    autoCreate: true,
    selection: false as any,
    transport: {
      read: ({ dataSet, params, data }:any) => {
        const queryData = dataSet?.getState('queryData');
        return {
          url: `/cbase/choerodon/v1/organizations/${organizationId}/users/${userId}/projects/paging`,
          method: 'post',
          data: queryData,
        };
      },
    },
    fields: [
      {
        name: 'name',
        label: formatProject({ id: 'c7ncd.project.project' }),
      },
      {
        name: 'code',
        label: formatProject({ id: 'c7ncd.project.code' }),
      },
      {
        name: 'enabled',
        label: formatProject({ id: 'c7ncd.project.status' }),
        type: 'boolean',
      },
      {
        name: 'rank',
        label: formatProject({ id: 'c7ncd.project.health.status' }),
      },
      {
        name: 'workGroup',
        label: formatProject({ id: 'c7ncd.project.work.group' }),
      },
      {
        name: 'projectClassfication',
        label: formatProject({ id: 'c7ncd.project.Classify' }),
      },
      {
        name: 'programName',
        label: formatProject({ id: 'c7ncd.project.project.group' }),
      },
      {
        name: 'categories',
        label: formatProject({ id: 'c7ncd.project.project.type' }),
      },
      {
        name: 'description',
        label: formatProject({ id: 'c7ncd.project.project.des' }),
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
      ...extraFields,
    ],
  });
});
