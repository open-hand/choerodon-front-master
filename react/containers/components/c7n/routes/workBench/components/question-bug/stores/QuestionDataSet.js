/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';

import { get, isEqual, map } from 'lodash';
import { toJS } from 'mobx';

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
      data: { searchVO: {}, ...(data.searchData || {}), type },
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
          const tempId = get(cacheStore.bugQuestions, 'selectedProjectId');
          const searchData = toJS(get(cacheStore.bugQuestions, 'searchData'));

          let tempArr;
          if (storeArr && (!data.searchData || isEqual(searchData, data.searchData))) {
            if (tempType !== type || tempId !== selectedProjectId) {
              tempArr = content;
            } else {
              tempArr = storeArr.concat(res.content);
            }
          } else {
            tempArr = content;
          }
          const tempObj = {
            ...rest,
            content: tempArr,
            selectedProjectId,
            type,
            searchData: data.searchData,
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
