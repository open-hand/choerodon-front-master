import { useLocalStore } from 'mobx-react-lite';
import { unset } from 'lodash';
import { axios } from '@/index';

export default function useStore(focusQuestions, organizationId, removeCache) {
  return useLocalStore(() => ({
    tabKey: focusQuestions.type || 'myStarBeacon',
    // 刷新用
    noticeRefreshValue: 0,
    changeTabKey(value) {
      this.tabKey = value;
    },
    page: 1,
    get getPage() {
      return this.page;
    },
    setPage(data) {
      this.page = data;
    },

    totalCount: 0,
    get getTotalCount() {
      return this.totalCount;
    },
    setTotalCount(data) {
      this.totalCount = data;
    },

    hasMore: false,
    get getHasMore() {
      return this.hasMore;
    },
    setHasMore(data) {
      this.hasMore = data;
    },
    init() {
      this.page = 1;
      this.totalCount = 0;
      this.hasMore = false;
    },

    treeData: {},
    get getTreeData() {
      return this.treeData;
    },
    setTreeData(data) {
      this.treeData = data;
    },
    async cancelStar(instanceId, projectId) {
      await axios({
        method: 'post',
        url: `agile/v1/organizations/${organizationId}/work_bench/star_beacon/unstar`,
        data: {
          instanceId,
          projectId,
          type: this.tabKey === 'myStarBeacon_backlog' ? 'backlog' : 'issue',
        },
      });
      removeCache('content');
      this.noticeRefreshValue += 1;
      if (isNaN(this.noticeRefreshValue)) {
        this.noticeRefreshValue = 0;
      }
    },
  }));
}
