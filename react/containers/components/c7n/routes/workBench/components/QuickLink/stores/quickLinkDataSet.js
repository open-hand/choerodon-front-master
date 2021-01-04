/* eslint-disable import/no-anonymous-default-export */
export default ({
  quickLinkUseStore, organizationId, selectedProjectId, linkType, cacheStore,
}) => ({
  autoQuery: false,
  paging: true,
  pageSize: 10,
  transport: {
    read: ({ data, dataSet }) => ({
      url: `/iam/choerodon/v1/organizations/${organizationId}/quick_links/scope/${linkType}${selectedProjectId ? `?project_id=${selectedProjectId}` : ''}`,
      method: 'get',
      transformResponse(res) {
        try {
          const mainData = JSON.parse(res);
          const {
            content,
            ...rest
          } = mainData;
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
          quickLinkUseStore.setListHasMore(
            mainData.totalElements > 0 && (mainData.number + 1) < mainData.totalPages,
          );
          // 这里通过ds，工作台层缓存数据，为了在编辑阶段不重新load数据，type是为了标识当前的tab
          const cacheData = {
            ...rest,
            content: newData,
            type: linkType,
          };
          cacheStore.setCacheQuickLinkData(cacheData);
          return newData;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  },
});
