import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore() {
  return useLocalStore(() => ({
    canCreate: false,
    get getCanCreate() {
      return this.canCreate;
    },
    setCanCreate(flag) {
      this.canCreate = flag;
    },

    async checkCreate(organizationId) {
      try {
        const res = await axios.get(`iam/v1/organizations/${organizationId}/projects/check_enable_create`);
        this.setCanCreate(res && !res.failed);
      } catch (e) {
        this.setCanCreate(false);
      }
    },
  }));
}
