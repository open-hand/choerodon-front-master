/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';
import { get } from 'lodash';

export default (({
  organizationId, questionStore, selectedProjectId, cacheStore,
}) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => ({
      url: `agile/v1/organizations/${organizationId}/work_bench/personal/my_reported?page=${questionStore.getPage || 1}&size=10${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
      method: 'post',
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
          cacheStore.setReportQuestions(tempObj);
          return tempArr;
        } catch (e) {
          return response;
        }
      },
    }),
  },
}));
