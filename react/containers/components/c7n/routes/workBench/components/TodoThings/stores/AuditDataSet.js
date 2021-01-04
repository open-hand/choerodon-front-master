/* eslint-disable import/no-anonymous-default-export */
export default (({ organizationId, selectedProjectId, cacheStore }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/approval${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse: (value) => {
        try {
          const data = JSON.parse(value);
          const tempData = {
            content: data,
            selectedProjectId,
          };
          cacheStore.setTodoThingsData(tempData);

          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
}));
