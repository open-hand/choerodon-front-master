import { useLocalStore } from 'mobx-react-lite';
import { localPageCacheStore } from '@/containers/stores/c7n/LocalPageCacheStore';

export default function useStore(bugQuestions) {
  return useLocalStore(() => ({
    tabKey: bugQuestions.type || localPageCacheStore.getItem('work.bench.question-bug.tabKey') || 'reportedBug',
    changeTabKey(value) {
      localPageCacheStore.setItem('work.bench.question-bug.tabKey', value);
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
  }));
}
