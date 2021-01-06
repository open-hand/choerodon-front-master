/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';
import { get, map } from 'lodash';

export default (({
  organizationId, questionStore, cacheStore, selectedProjectId, type,
}) => ({
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ dataSet }) => {
      const isRequire = type === 'myStarBeacon_backlog';
      return ({
        url: `agile/v1/organizations/${organizationId}/${isRequire ? 'backlog/star_beacon/personal/backlog_myStarBeacon' : 'work_bench/personal/backlog_issues'}?page=${questionStore.getPage || 1}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
        method: isRequire ? 'get' : 'post',
        data: isRequire ? null : { type: 'myStarBeacon' },
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
            const storeArr = get(cacheStore.focusQuestions, 'content')?.slice();
            const tempType = get(cacheStore.focusQuestions, 'type');
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
            cacheStore.setFocusQuestions(tempObj);
            return tempArr;
          } catch (e) {
            throw new Error(e);
          }
        },
      });
    },
  },
}));
