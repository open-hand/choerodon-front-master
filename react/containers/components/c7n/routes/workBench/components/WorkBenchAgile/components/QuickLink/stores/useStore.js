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
    axiosTopIf(data) {
      return axios.put(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links/${data.id}/${data.top ? 'delete_top' : 'add_top'}`);
    },
    axiosGetQuickLinkList(id, type) {
      axios.get(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links/scope/${type}?page=0&size=${this.getParams.size}${id ? `&project_id=${id}` : ''}`).then((res) => {
        this.setQuickLinkList(res.content);
        this.setParams({
          size: res.size,
          hasMore: (res.numberOfElements >= res.size) && (res.totalElements % 10 > 0),
        });
      });
    },
    axiosCreateQuickLink(data, activeId, type) {
      axios.post('/iam/choerodon/v1/organizations/7/quick_links', data).then(() => {
        this.axiosGetQuickLinkList(activeId, type);
      });
    },
    axiosDeleteQuickLink(id, activeId, type) {
      axios.delete(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links/${id}`).then(() => {
        this.axiosGetQuickLinkList(activeId, type);
      });
    },
    axiosEditQuickLink(data, activeId, type) {
      axios.put(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/quick_links/${data.id}`, data).then(() => {
        this.axiosGetQuickLinkList(activeId, type);
      });
    },
  }));
}
