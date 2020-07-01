import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';
// import HeaderStore from '@/containers/stores/c7n/HeaderStore';
// import MenuStore from '@/containers/stores/c7n/MenuStore';
// import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
// import { historyPushMenu } from '@/utils';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    sprints: [],
    staredSprint: undefined,
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
    loadAllSprint() {
      return axios.post(`/agile/v1/projects/${projectId}/sprint/names`, ['started', 'closed']);
    },

    loadQuestions({ organizationId, projectId, page }) {
      return axios.post(`agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${page}&size=20${projectId ? `&projectId=${projectId}` : ''}`);
    },
  }));
}
