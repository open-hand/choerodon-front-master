import { useLocalStore } from 'mobx-react-lite';

import { axios } from '@/index';

export default function useStore() {
  return useLocalStore(() => ({
    data: {},

    get getData() {
      return this.data;
    },

    setData(value) {
      this.data = { ...value };
    },

    lineData: {},

    get getLineDatas() {
      return this.lineData;
    },

    setLineData(value) {
      this.lineData = { ...value };
    },

    task: {},

    get getTask() {
      return this.task;
    },

    setTask(value) {
      this.task = { ...value };
    },

    retry(id, organizationId, type, apiGetway) {
      switch (type) {
        case 'organization':
          return axios.put(`/iam/choerodon/v1/organization/${organizationId}/${id}/org/retry`);
        case 'project':
          return axios.put(`${apiGetway}tasks/instances/${id}/retry`);
        case 'site':
          return axios.put(`/iam/choerodon/v1/site/0/${id}/site/retry`);
        default:
          break;
      }
      return true;
    },

    unLock(id, apiGetway) {
      return axios.put(`${apiGetway}tasks/instances/${id}/unlock`);
    },

    /**
   * 强制失败
   * @param id
   */
    abort(id, apiGetway) {
      return axios.put(`${apiGetway}tasks/instances/${id}/failed`);
    },
    /**
  * 详情
  * @param id
  */
    loadDetailData(id, apiGetway) {
      return axios.get(`${apiGetway}instances/${id}`);
    },
  }));
}
