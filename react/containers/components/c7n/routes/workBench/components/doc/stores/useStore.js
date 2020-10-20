import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    docData: [],
    pageInfo: {
      page: 0,
      size: 6,
    },
    self: false,
    isFistLoad: true,
    loading: true,
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
    axiosGetDoc(isSelf = false, isFistLoad = false) {
      this.isFistLoad = isFistLoad;
      return axios({
        method: 'get',
        url: `/knowledge/v1/organizations/${AppState.currentMenuType.organizationId}/work_space/recent_project_update_list${isSelf ? '/self' : ''}`,
        params: {
          page: isFistLoad || this.self !== isSelf ? 1 : this.pageInfo.page + 1,
          size: this.pageInfo.size,
        },
      }).then((res) => {
        if (isFistLoad || this.self !== isSelf) {
          this.isFistLoad = false;
          this.setDocData(res.content);
          this.setPageInfo({ page: 1, size: 6, hasNext: res.totalPages > res.number });
        } else {
          this.setDocData(this.docData.concat(res.content));
          this.setPageInfo({ page: this.pageInfo.page + 1, size: 6, hasNext: res.totalPages > res.number });
        }
        this.self = isSelf;
      });
    },
  }));
}
