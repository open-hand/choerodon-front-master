import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';
import axios0 from 'axios';
// import HeaderStore from '@/containers/stores/c7n/HeaderStore';
// import MenuStore from '@/containers/stores/c7n/MenuStore';
// import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
// import { historyPushMenu } from '@/utils';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    isFinishLoad:false,
    sprints: [],
    staredSprint: undefined,
    totalOnlineUser: 0,

    get getIsFinishLoad() {
      return this.isFinishLoad;
    },
    setIsFinishLoad(data) {
      this.isFinishLoad = data;
    },
    get getSprints() {
      return this.sprints;
    },
    setSprints(data) {
      this.sprints = data;
    },
    get getStaredSprint() {
      return this.staredSprint;
    },
    setStaredSprint(data) {
      this.staredSprint = data;
    },

    setTotalOnlineUser(data) {
      this.totalOnlineUser = data;
    },
    get getTotalOnlineUser() {
      return this.totalOnlineUser;
    },

    loadAllSprint() {
      return axios.post(`/agile/v1/projects/${projectId}/sprint/names`, ['started', 'closed']);
    },
  }));
}
