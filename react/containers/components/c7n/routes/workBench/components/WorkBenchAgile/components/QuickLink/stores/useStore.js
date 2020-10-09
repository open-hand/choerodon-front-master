import { useLocalStore } from 'mobx-react-lite';
import axios from '../../../../../../../tools/axios';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    quickLinkList: [],
    params: {
      size: 10,
      hasMore: false,
    },
    get getParams() {
      return this.params;
    },
    setParams(data) {
      this.params = data;
    },
    get getQuickLinkList() {
      return this.quickLinkList;
    },
    setQuickLinkList(data) {
      this.quickLinkList = data;
    },
    axiosGetQuickLinkList(id) {
      axios.get(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links?page=0&size=${this.getParams.size}${id ? `&project_id=${id}` : ''}`).then((res) => {
        this.setQuickLinkList(res.content);
        this.setParams({
          size: res.size,
          hasMore: (res.numberOfElements >= res.size) && (res.totalElements % 10 > 0),
        })
      })
    },
    axiosCreateQuickLink(data, id) {
      axios.post(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links`, data).then(() => {
        this.axiosGetQuickLinkList(id);
      })
    },
    axiosDeleteQuickLink(id) {
      axios.delete(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links/${id}`).then(() => {
        this.axiosGetQuickLinkList();
      });
    },
    axiosEditQuickLink(data, id) {
      axios.put(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links/${data.id}`, data).then(() => {
        this.axiosGetQuickLinkList(id);
      })
    },
  }));
}
