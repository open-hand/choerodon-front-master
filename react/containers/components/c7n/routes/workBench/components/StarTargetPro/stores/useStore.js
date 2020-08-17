import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    starProjects: [],
    get getStarProjects() {
      return this.starProjects;
    },
    setStarProjects(data) {
      this.starProjects = data;
    },
    axiosGetStarProjects() {
      axios.get(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/star_projects?size=6`).then((res) => {
        this.setStarProjects(res);
      })
    }
  }));
}
