import JSONbig from 'json-bigint';
import { get, isEqual } from 'lodash';
import { toJS } from 'mobx';
import getQuestionTreeData from '../../../utils/getQuestionTreeData';

const MyHandlerDataSet = ({
  selectedProjectId, organizationId, myHandlerStore, cacheStore,
}) => ({
  id: `my-handler-${organizationId}`,
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
        size: 20,
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
          // const searchData = toJS(get(cacheStore.myHandlerIssues, 'searchData'));
          const searchDataId = get(cacheStore.myHandlerIssues, 'searchDataId');

          let tempArr;
          if (storeArr && isEqual(searchDataId, data.searchDataId)) {
            if (tempId !== selectedProjectId || !res.number) {
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
            searchDataId: data.searchDataId,
            organizationId,
          };
          cacheStore.setMyHandlerIssues(tempObj);
          return tempArr;
        } catch (e) {
          return response;
        }
      },
    }),
  },
  events: {
    load: ({ dataSet }) => {
      const treeData = getQuestionTreeData(dataSet.toData());
      myHandlerStore.setTreeData(treeData);
    },
  },
});

export default MyHandlerDataSet;
