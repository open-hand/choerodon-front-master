import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';

export default function useStore(organizationId, projectId,sprintId) {
  return useLocalStore(() => ({
    restDays: [],
    get getRestDays() {
      return this.restDays;
    },
    setRestDays(data) {
      this.restDays = data;
    },
    burnDownList: [],
    get getBurnDownList() {
      return this.burnDownList;
    },
    setBurnDownList(data) {
      this.burnDownList = data;
    },
    axiosGetChartData(sprintId,selectType) {
      return axios({
        method: 'get',
        url: `/agile/v1/projects/${projectId}/reports/${sprintId}/burn_down_report/coordinate`,
        params: {
          type: selectType,
        },
      })
    },
    /**
  * 根据冲刺id查询冲刺的时间范围内非工作日(包含周六周天)
  */
    axiosGetRestDays(sprintId) {
      return axios.get(`/agile/v1/projects/${projectId}/sprint/query_non_workdays/${sprintId}/${organizationId}`);
    },

  }));
}
