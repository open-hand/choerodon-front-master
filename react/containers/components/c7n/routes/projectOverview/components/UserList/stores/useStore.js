import { useLocalStore } from 'mobx-react-lite';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    totalUser: 0,
    setTotalUser(value) {
      this.totalUser = value;
    },
  }));
}
