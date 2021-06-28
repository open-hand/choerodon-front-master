import JSONbig from 'json-bigint';
import { get, isEqual } from 'lodash';
import { toJS } from 'mobx';

const MyHandlerDataSet = ({
  selectedProjectId, organizationId, myHandlerStore, cacheStore,
}) => ({
  id: `my-handler-${organizationId}-${selectedProjectId}`,
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => ({
      url: `/agile/v1/organizations/${organizationId}/work_bench/personal/my_assigned`,
      method: 'post',
      params: {
        projectId: selectedProjectId,
        page: myHandlerStore.getPage || 1,
        size: 10,
      },
      data: data.searchData || { searchVO: {} },
      transformResponse(response) {
        try {
          const res = JSONbig.parse(response);
          if (res && res.failed) {
            return res;
          }
          myHandlerStore.setTotalCount(res.totalElements);
          myHandlerStore.setHasMore(res.totalElements && (res.number + 1) < res.totalPages);
          const storeArr = get(cacheStore.myHandlerIssues, 'content');
          const tempId = get(cacheStore.myHandlerIssues, 'selectedProjectId');
          const searchData = toJS(get(cacheStore.myHandlerIssues, 'searchData'));

          let tempArr;
          if (storeArr && (!data.searchData || isEqual(searchData, data.searchData))) {
            if (tempId !== selectedProjectId) {
              tempArr = res.content;
            } else {
              tempArr = storeArr.concat(res.content);
            }
          } else {
            tempArr = res.content;
          }
          const tempObj = {
            ...res,
            content: tempArr || [],
            selectedProjectId,
            searchData: data.searchData,
          };
          cacheStore.setMyHandlerIssues(tempObj);
          return tempArr;
        } catch (e) {
          return response;
        }
      },
    }),
  },
});

export default MyHandlerDataSet;
