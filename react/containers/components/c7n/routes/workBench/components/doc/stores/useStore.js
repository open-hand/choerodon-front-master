import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';

export default function useStore() {
  return useLocalStore(() => ({
    docData: [],
    pageInfo: {
      page: 0,
      size: 6,
    },
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
    get getPageInfo() {
      return this.pageInfo;
    },
    setPageInfo(data) {
      this.pageInfo = data;
    },
    get getDocData() {
      return this.docData;
    },
    setDocData(data) {
      this.docData = data;
    },
  }));
}
