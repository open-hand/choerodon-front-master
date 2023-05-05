export default ({
  organizationId, projectId,
}) => ({
  autoCreate: false,
  autoQuery: true,
  transport: {
    read: ({ params, data }) => ({
      url: `/cbase/choerodon/v1/organizations/${organizationId}/project_template_classfication/list`,
      transformResponse: (res) => {
        const newRes = JSON.parse(res);
        return newRes.filter((item) => item.name !== '所有项目模板');
      },
    }),
  },
});
