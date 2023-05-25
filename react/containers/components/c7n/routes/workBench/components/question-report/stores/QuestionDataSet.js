/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';
import { get, isEqual } from 'lodash';
import { toJS } from 'mobx';
import getQuestionTreeData from '../../../utils/getQuestionTreeData';

export default (({
  organizationId, questionStore, selectedProjectId, cacheStore,
}) => ({
  id: `report-${organizationId}`,
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => ({
      url: `agile/v1/organizations/${organizationId}/work_bench/personal/my_reported?page=${questionStore.getPage || 1}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
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
          const storeArr = get(cacheStore.reportQuestions, 'content');
          const tempId = get(cacheStore.reportQuestions, 'selectedProjectId');
          const searchData = toJS(get(cacheStore.reportQuestions, 'searchData'));
          let tempArr;
          if (storeArr && isEqual(searchData, data.searchDataId)) {
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
            searchData: data.searchDataId,
            organizationId,
          };
          cacheStore.setReportQuestions(tempObj);
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
      questionStore.setTreeData(treeData);
    },
  },
}));
