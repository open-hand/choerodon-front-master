import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({
    listHasMore: false,
    get getListHasMore() {
      return this.listHasMore;
    },
    setListHasMore(flag) {
      this.listHasMore = flag;
    },

    selfDoc: false,
    setSelfDoc(value) {
      this.selfDoc = value;
    },
    get getSelfDoc() {
      return this.selfDoc;
    },

  }));
}
