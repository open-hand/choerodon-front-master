import JSONbig from 'json-bigint';
import { get } from 'lodash';

const MyHandlerDataSet = ({
  selectedProjectId, organizationId, myHandlerStore, cacheStore,
}) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: () => ({
      url: `/agile/v1/organizations/${organizationId}/work_bench/personal/my_assigned`,
      method: 'post',
      params: {
        projectId: selectedProjectId,
        page: myHandlerStore.getPage || 1,
        size: 10,
      },
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
          let tempArr;
          if (storeArr) {
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
            content: tempArr,
            selectedProjectId,
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
