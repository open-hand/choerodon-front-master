import { useLocalStore } from 'mobx-react-lite';

export default function useStore(focusQuestions) {
  return useLocalStore(() => ({
    tabKey: focusQuestions.type || 'myStarBeacon',
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

  }));
}
