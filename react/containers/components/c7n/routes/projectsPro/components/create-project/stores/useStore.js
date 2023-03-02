import { useLocalStore } from 'mobx-react-lite';
import { has as hasInject, get as getInject } from '@choerodon/inject';
import { axios } from '@/index';

export default function useStore() {
  return useLocalStore(() => ({
    isSenior: true,
    get getIsSenior() {
      return this.isSenior;
    },
    setIsSenior(flag) {
      this.isSenior = flag;
    },

    async hasProgramProjects(organizationId, projectId) {
      try {
        const res = await axios.get(`/cbase/choerodon/v1/organizations/${organizationId}/project_relations/${projectId}/${projectId}`);
        if (res && !res.failed && res.length) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    async checkSenior(organizationId, func) {
      if (func) {
        const res = await func(organizationId);
        this.setIsSenior(res);
      } else {
        this.setIsSenior(true);
      }
    },
  }));
}
