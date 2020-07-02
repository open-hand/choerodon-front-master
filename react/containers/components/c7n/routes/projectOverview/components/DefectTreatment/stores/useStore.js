import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(organizationId, projectId) {
  return useLocalStore(() => ({
    chartList: {},
    get getChartList() {
      return this.burnDownList;
    },
    setChartList(data) {
      console.log('setChartList',setChartList);
      this.burnDownList = data;
    },
    axiosGetChartData(sprintId) {
      return axios({
        method: 'get',
        url: `/agile-20340/v1/projects/${projectId}/project_overview/${sprintId}/issue`,
      }).then(res=>this.setChartList(res));
    },


  }));
}
