import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(projectId) {
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
        url: `/agile/v1/projects/${projectId}/project_overview/${sprintId}/issue_count`,
      }).then(res=>{
        this.setChartList(res)
      });
    },


  }));
}
