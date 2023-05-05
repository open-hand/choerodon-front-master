export default ({
  organizationId, projectId,
}) => ({
  autoCreate: false,
  autoQuery: true,
  paging: false,
  transport: {
    read: ({ params, data }) => ({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${organizationId}/project_template_classfication/list`,
      transformResponse: (res) => {
        const newRes = JSON.parse(res);
        return newRes?.filter((item) => item.name !== '所有项目模板');
      },
    }),
  },
});
