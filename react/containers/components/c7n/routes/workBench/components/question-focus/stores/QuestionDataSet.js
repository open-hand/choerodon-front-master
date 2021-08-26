/* eslint-disable import/no-anonymous-default-export */
import JSONbig from 'json-bigint';
import { get, isEqual, map } from 'lodash';
import { toJS } from 'mobx';
import getQuestionTreeData from '../../../utils/getQuestionTreeData';

export default (({
  organizationId, questionStore, cacheStore, selectedProjectId, type,
}) => ({
  id: `focus-${type}-${organizationId}`,
  autoQuery: false,
  selection: false,
  primaryKey: 'issueId',
  idField: 'issueId',
  parentField: 'parentId',
  transport: {
    read: ({ dataSet, data }) => {
      const isRequire = type === 'myStarBeacon_backlog';
      return ({
        url: `agile/v1/organizations/${organizationId}/${isRequire ? 'backlog/work_bench/personal/backlog_my_star_beacon' : 'work_bench/personal/backlog_issues'}?page=${questionStore.getPage || 1}&size=20${selectedProjectId ? `&projectId=${selectedProjectId}` : ''}`,
        method: 'post',
        data: { searchVO: {}, ...(data.searchData || {}), type: isRequire ? undefined : 'myStarBeacon' },
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
            // const searchData = toJS(get(cacheStore.focusQuestions, 'searchData'));
            const searchDataId = get(cacheStore.focusQuestions, 'searchDataId');

            let tempArr = [];
            if (storeArr && isEqual(searchDataId, data.searchDataId)) {
              if (tempType !== type || tempId !== selectedProjectId || !res.number) {
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
              searchDataId: data.searchDataId,
              organizationId,
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
  events: {
    load: ({ dataSet }) => {
      const isRequire = type === 'myStarBeacon_backlog';
      const treeData = getQuestionTreeData(dataSet.toData(), !isRequire, isRequire ? 'id' : 'issueId');
      questionStore.setTreeData(treeData);
    },
  },
}));
