export default (AppState, detail) => ({
  autoCreate: true,
  fields: [{
    type: 'string',
    name: 'scope',
    defaultValue: 'project',
  }, {
    name: 'projectId',
    type: 'string',
    label: '项目',
    textField: 'name',
    valueField: 'id',
    dynamicProps: {
      required: ({ record }) => record.get('scope') === 'project',
    },
    lookupAxiosConfig: (data) => {
      return ({
        method: 'get',
        url: `/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/users/${AppState.getUserId}/projects/paging?page=0&size=10`,
        data: {
          param: [],
          searchParams: {
            name: data.params.name,
          }
        },
        transformResponse: (res) => {
          let newRes;
          try {
            newRes = JSON.parse(res);
            if (newRes.content.length % 10 === 0 && newRes.content.length !== 0) {
              newRes.content.push({
                id: 'more',
                name: '加载更多',
              });
            }
            if (!newRes.content.some(n => n.id === detail.projectId)) {
              newRes.content.unshift({
                id: detail.projectId,
                name: detail.projectName,
              })
            }
            return newRes;
          } catch (e) {
            return res;
          }
        },
      })
    }
  }, {
    name: 'name',
    type: 'string',
    label: '链接名称',
    required: true,
    maxLength: 30,
  }, {
    name: 'linkUrl',
    type: 'string',
    label: '链接地址',
    required: true,
  }]
})
