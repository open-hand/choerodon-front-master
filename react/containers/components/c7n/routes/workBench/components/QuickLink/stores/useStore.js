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
    async axiosCreateQuickLink(data, activeId, type) {
      await axios.post(`/iam/choerodon/v1/organizations/${activeId}/quick_links`, data);
    },
    async axiosDeleteQuickLink(id, activeId, type) {
      await axios.delete(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${id}`);
    },
    async axiosEditQuickLink(data, activeId, type) {
      await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${data.id}`, data);
    },
  }));
}
