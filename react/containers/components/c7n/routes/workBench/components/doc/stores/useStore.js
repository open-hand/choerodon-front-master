import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({
    docData: [],
    selfDoc: false,
    self: false,
    isFistLoad: true,
    loading: true,
    setSelfDoc(value) {
      this.selfDoc = value;
    },
    get getSelfDoc() {
      return this.selfDoc;
    },
    get getLoading() {
      return this.loading;
    },
    get getIsFistLoad() {
      return this.isFistLoad;
    },
    setLoading(data) {
      this.loading = data;
    },
    get getDocData() {
      return this.docData;
    },
    setDocData(data) {
      this.docData = data;
    },
  }));
}
