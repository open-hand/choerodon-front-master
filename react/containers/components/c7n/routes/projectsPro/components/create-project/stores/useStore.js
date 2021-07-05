import { useLocalStore } from 'mobx-react-lite';
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
      try {
        const res = await axios.get(`/iam/choerodon/v1/register_saas/check_senior_project_type?tenantId=${organizationId}`);
        if (res && res.failed) {
          this.setIsSenior(false);
          return false;
        }
        this.setIsSenior(res);
        return res;
      } catch (error) {
        this.setIsSenior(false);
        return false;
      }
    },
  }));
}
