import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    starProjects: [],
    get getStarProjects() {
      return this.starProjects;
    },
    setStarProjects(data) {
      this.starProjects = data;
    },
    axiosGetDoc(isSelf = false) {
      axios({
        method: 'get',
        url: `/knowledge/v1/projects/${AppState.currentMenuType.id}/work_space/recent_project_update_list${isSelf ? '/self' : ''}`,
        params: {
          organizationId: AppState.currentMenuType.organizationId,
        },
      }).then((res) => {
        this.setStarProjects(res);
      });
    },
  }));
}
