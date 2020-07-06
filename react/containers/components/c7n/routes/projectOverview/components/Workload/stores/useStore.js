import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    data: undefined,
    get getData() {
      return this.data;
    },
    setData(data) {
      this.data = data;
    },
    axiosGetTableData(sprintId) {
      return axios({
        method: 'get',
        url: `/agile/v1/projects/${projectId}/project_overview/${sprintId}/one_jobs`,
      }).then(res=>this.setData(res));
    },


  }));
}
