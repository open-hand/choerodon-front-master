import { useLocalStore } from 'mobx-react-lite';

export default function useStore(AppState) {
  return useLocalStore(() => ({

    listHasMore: false,
    get getListHasMore() {
      return this.listHasMore;
    },
    setListHasMore(flag) {
      this.listHasMore = flag;
    },
  }));
}
