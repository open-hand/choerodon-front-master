/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';

import { get, map } from 'lodash';

export default (({
  organizationId, questionStore, selectedProjectId, type, cacheStore,
}) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ data }) => ({
      url: `agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${questionStore.getPage || 1}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
      method: 'post',
      data: { type },
      transformResponse(response) {
        try {
          const res = JSONbig.parse(response);
          const {
            content,
            ...rest
          } = res;
          if (res && res.failed) {
            return res;
          }
          questionStore.setTotalCount(res.totalElements);
          questionStore.setHasMore(res.totalElements && (res.number + 1) < res.totalPages);
          const storeArr = get(cacheStore.bugQuestions, 'content')?.slice();
          const tempType = get(cacheStore.bugQuestions, 'type');
          const tempId = get(cacheStore.focusQuestions, 'selectedProjectId');
          let tempArr;
          if (tempType === type && tempId && tempId === selectedProjectId) {
            tempArr = storeArr.concat(res.content);
          } else {
            tempArr = content;
          }
          const tempObj = {
            ...rest,
            content: tempArr,
            selectedProjectId,
            type,
          };
          cacheStore.setBugQuestions(tempObj);
          return tempArr;
        } catch (e) {
          return response;
        }
      },
    }),
  },
}));
