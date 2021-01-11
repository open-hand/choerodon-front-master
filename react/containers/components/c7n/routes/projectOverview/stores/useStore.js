import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    isEdit: false,
    setEdit(value) {
      this.isEdit = value;
    },

    isFinishLoad: false,
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
