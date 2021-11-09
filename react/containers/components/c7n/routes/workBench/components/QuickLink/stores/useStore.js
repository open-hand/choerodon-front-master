import { useLocalStore } from 'mobx-react-lite';
import axios from '@/components/axios';

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
    async axiosDeleteQuickLink(id, activeId, type) {
      await axios.delete(`/iam/choerodon/v1/organizations/${organizationId}/quick_links/${id}`);
    },
  }));
}
