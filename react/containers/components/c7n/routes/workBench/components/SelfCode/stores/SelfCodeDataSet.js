/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';

export default (({ selectedProjectId, organizationId, mainStore }) => ({
  autoQuery: true,
  selection: false,
  paging: true,
  pageSize: 10,
  transport: {
    read: ({ dataSet }) => ({
      url: `/devops/v1/organizations/${organizationId}/work_bench/latest_commit${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse(res) {
        try {
          const mainData = JSONbig.parse(res);
          if (mainData && mainData.failed) {
            return mainData;
          }
          let newData = [...mainData.content];
          if (mainData.number > 0 && dataSet) {
            newData = [...dataSet.toData(), ...mainData.content];
          }
          if (dataSet) {
            // eslint-disable-next-line no-param-reassign
            dataSet.pageSize *= (mainData.number + 1);
          }
          mainStore.setListHasMore(
            mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
          );

          return newData;
        } catch (error) {
          return error;
        }
      },
    }),
  },
  fields: [],
}));
