import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(organizationId, projectId) {
  return useLocalStore(() => ({
    loading: true,
    get getLoading() {
      return this.loading;
    },
    setLoading(data) {
      this.loading = data;
    },
    list: [],
    get getList() {
      return this.list.slice();
    },
    setList(data) {
      this.list = data;
    },
    axiosGetList(sprintId) {
      return axios({
        method: 'get',
        url: `/agile/v1/projects/${projectId}/project_overview/${sprintId}/XXXXX`,
      }).then(res => this.setList(res));
    },

  }));
}
