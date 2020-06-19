import { useLocalStore } from 'mobx-react-lite';
import axios from '../../../../../../../tools/axios';

export default function useStore({ organizationId }) {
  return useLocalStore(() => ({
    quickLinkList: [],
    get getQuickLinkList() {
      return this.quickLinkList;
    },
    setQuickLinkList(data) {
      this.quickLinkList = data;
    },
    axiosGetQuickLinkList() {
      axios.get(`/iam/choerodon/v1/organizations/${organizationId}/quick_links?page=0&size=99`).then((res) => {
        this.setQuickLinkList(res.content);
      })
    },
    axiosCreateQuickLink(data) {
      axios.post(`/iam/choerodon/v1/organizations/7/quick_links`, data).then(() => {
        this.axiosGetQuickLinkList();
      })
    },
    axiosDeleteQuickLink(id) {
      axios.delete(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${id}`).then(() => {
        this.axiosGetQuickLinkList();
      });
    },
    axiosEditQuickLink(data) {
      axios.put(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${data.id}`, data).then(() => {
        this.axiosGetQuickLinkList();
      })
    },
  }));
}
