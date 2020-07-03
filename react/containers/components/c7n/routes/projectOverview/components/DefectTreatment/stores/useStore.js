import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(organizationId, projectId) {
  return useLocalStore(() => ({
    chartList: undefined,
    get getChartList() {
      return this.chartList;
    },
    setChartList(data) {
      this.chartList = data;
    },
    axiosGetChartData(sprintId) {
      return axios({
        method: 'get',
        url: `/agile-20340/v1/projects/${projectId}/project_overview/${sprintId}/issue`,
      }).then(res=>this.setChartList(res));
    },


  }));
}
