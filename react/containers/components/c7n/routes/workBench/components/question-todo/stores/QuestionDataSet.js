/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';
import { get, isEqual } from 'lodash';
import { toJS } from 'mobx';
import getQuestionTreeData from '../../../utils/getQuestionTreeData';

export default (({
  organizationId, questionStore, selectedProjectId, cacheStore,
}) => ({
  id: `backlog_issues-${organizationId}`,
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  paging: false,
  transport: {
    read: ({ data }) => ({
      url: `agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${questionStore.getPage || 1}&size=10${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
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
          const storeArr = get(cacheStore.todoQuestions, 'content');
          const tempId = get(cacheStore.todoQuestions, 'selectedProjectId');
          // const searchData = toJS(get(cacheStore.todoQuestions, 'searchData'));
          const searchDataId = get(cacheStore.todoQuestions, 'searchDataId');

          let tempArr;
          if (storeArr && isEqual(searchDataId, data.searchDataId)) {
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
            searchData: data.searchData,
            searchDataId: data.searchDataId,
            organizationId,
          };
          // console.log('searchData....', searchData, data.searchDataId, isEqual(searchData, data.searchDataId), tempObj);
          cacheStore.setTodoQuestions(tempObj);
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
      console.log(treeData);
      questionStore.setTreeData(treeData);
    },
  },
}));
