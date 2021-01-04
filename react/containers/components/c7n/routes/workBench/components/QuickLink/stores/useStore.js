import { useLocalStore } from 'mobx-react-lite';
import axios from '@/containers/components/c7n/tools/axios';

export default function useStore(organizationId, AppState) {
  return useLocalStore(() => ({
    listHasMore: false,
    get getListHasMore() {
      return this.listHasMore;
    },
    setListHasMore(flag) {
      this.listHasMore = flag;
    },

    type: 'project',
    setType(value) {
      this.type = value;
    },

    quickLinkList: [],

    get getQuickLinkList() {
      return this.quickLinkList;
    },
    setQuickLinkList(data) {
      this.quickLinkList = data;
    },
    axiosTopIf(data) {
      return axios.put(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${data.id}/${data.top ? 'delete_top' : 'add_top'}`);
    },
    axiosCreateQuickLink(data, activeId, type) {
      axios.post(`/iam/choerodon/v1/organizations/${activeId}/quick_links`, data);
    },
    axiosDeleteQuickLink(id, activeId, type) {
      axios.delete(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${id}`);
    },
    axiosEditQuickLink(data, activeId, type) {
      axios.put(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${data.id}`, data);
    },
  }));
}
