import { useLocalStore } from 'mobx-react-lite';
import { observable } from 'mobx';
import { axios } from '@choerodon/boot';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    date: [],
    assignee: undefined,
    total: [],
    data: undefined,
    get getAssignee() {
      return this.assignee;
    },
    setAssignee(data) {
      this.assignee = data;
    },
    get getDate() {
      return this.date;
    },
    setDate(data) {
      this.date = data;
    },
    get getData() {
      return this.data;
    },
    setData(data) {
      this.data = data;
    },
    get getTotal() {
      return this.total;
    },
    setTotal(data) {
      this.total = data;
    },
    axiosGetTableData(sprintId) {
      return axios({
        method: 'get',
        url: `/agile/v1/projects/${projectId}/project_overview/${sprintId}/one_jobs`,
      }).then(res => {
        const date = [];
        const total = [];
        const assigneeSet = new Set();
        const data = observable.map();
        // 拆分数据
        res.forEach(item => {
          date.push(item.workDate);// 收集列数据
          total.push(item.total); // 收集总计数据
          const assignee = new Map(item.jobList.map(i => {
            assigneeSet.add(i.worker); // 收集内容行首数据
            return [i.worker, i];
          })); 
          data.set(item.workDate, assignee); // 收集对应日期下的人数据
        });
        this.setTotal(total);
        this.setData(data);
        this.setDate(date);
        this.setAssignee([...assigneeSet]);
      });
    },


  }));
}
