/* eslint-disable import/no-anonymous-default-export */
export default (({ selectedProjectId, cacheStore, organizationId }) => ({
  autoQuery: false,
  selection: false,
  paging: false,
  dataKey: null,
  transport: {
    read: {
      url: `devops/v1/organizations/${organizationId}/work_bench/latest_app_service${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse: (value) => {
        try {
          const data = JSON.parse(value);
          const tempData = {
            content: data,
            selectedProjectId,
          };
          cacheStore.setCacheAppServiceData(tempData);
          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
  fields: [],
}));
