/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';
import { get, isEqual } from 'lodash';
import { toJS } from 'mobx';

export default (({
  organizationId, questionStore, selectedProjectId, cacheStore,
}) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'executeId',
  idField: 'executeId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => ({
      url: `test/v1/organizations/${organizationId}/test_work_bench/personal/my_execution_case?page=${questionStore.getPage || 1}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
      method: 'post',
      data: data.searchData || { searchVO: {} },
      transformResponse(response) {
        try {
          const res = JSONbig.parse(response);
          if (res && res.failed) {
            return res;
          }
          questionStore.setTotalCount(res.totalElements);
          questionStore.setHasMore(res.totalElements && (res.number + 1) < res.totalPages);
          const storeArr = get(cacheStore.myExecutionQuestions, 'content');
          const tempId = get(cacheStore.myExecutionQuestions, 'selectedProjectId');
          const searchData = toJS(get(cacheStore.myExecutionQuestions, 'searchData'));

          let tempArr;
          const content = res.content.map((item) => ({
            ...item,
            statusVO: { name: item.executionStatusName, colour: item.statusColor },
            issueNum: item.planName,
            projectVO: item.projectDTO,
            priorityVO: { name: item.priorityName, colour: item.priorityColour },
            issueTypeVO: { icon: 'insert_invitation', name: '执行用例', color: '#6887E8' },
            typeCode: 'test-execution',
          }));
          console.log('contet,,', content, data.searchDataId, searchData, isEqual(searchData, data.searchDataId));
          if (storeArr && isEqual(searchData, data.searchDataId)) {
            if (tempId !== selectedProjectId) {
              tempArr = content;
            } else {
              tempArr = storeArr.concat(content);
            }
          } else {
            tempArr = content;
          }
          const tempObj = {
            ...res,
            content: tempArr,
            selectedProjectId,
            searchData: data.searchDataId,
          };
          console.log('tempObj...', tempObj, tempArr);
          cacheStore.setMyExecutionQuestions(tempObj);
          return tempArr;
        } catch (e) {
          return response;
        }
      },
    }),
  },
}));
