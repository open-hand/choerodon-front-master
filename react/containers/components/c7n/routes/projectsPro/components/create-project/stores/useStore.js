import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';
import { has as hasInject, get as getInject } from '@choerodon/inject';

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
        const res = await axios.get(`/iam/choerodon/v1/organizations/${organizationId}/project_relations/${projectId}/${projectId}`);
        if (res && !res.failed && res.length) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    async checkSenior(organizationId) {
      if (hasInject('base-saas:checkSaaSSenior')) {
        const res = await getInject('base-saas:checkSaaSSenior')(organizationId);
        this.setIsSenior(res);
      } else {
        this.setIsSenior(true);
      }
    },
  }));
}
