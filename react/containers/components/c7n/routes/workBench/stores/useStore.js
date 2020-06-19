import { useLocalStore } from 'mobx-react-lite';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    activeStarProject: undefined,
    get getActiveStarProject() {
      return this.activeStarProject;
    },
    setActiveStarProject(data) {
      this.activeStarProject = data;
    },
  }));
}
