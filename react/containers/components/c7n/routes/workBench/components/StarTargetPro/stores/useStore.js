import { useLocalStore } from 'mobx-react-lite';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    // loading: true,
    // get getLoading() {
    //   return this.loading;
    // },
    // setLoading(data) {
    //   this.loading = data;
    // },
    // starProjects: [],
    // get getStarProjects() {
    //   return this.starProjects;
    // },
    // setStarProjects(data) {
    //   this.starProjects = data;
    // },
    // axiosGetStarProjects() {
    //   this.setLoading(true);
    //   axios.get(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/star_projects?size=6`).then((res) => {
    //     this.setLoading(false);
    //     this.setStarProjects(res);
    //   }).catch(() => {
    //     this.setLoading(false);
    //   });
    // },
  }));
}
