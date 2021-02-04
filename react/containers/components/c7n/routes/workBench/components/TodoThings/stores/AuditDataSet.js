/* eslint-disable import/no-anonymous-default-export */
import JsonBig from 'json-bigint';

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
          const data = JsonBig.parse(value);
          if (data && data.failed) {
            return data;
          }
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
