import { useLocalStore } from 'mobx-react-lite';
import { map, pick } from 'lodash';
import { axios } from '@/index';
import mappings from './mappings';

export default function useStore(projectId) {
  return useLocalStore(() => ({
    queryComponents: [],
    setQueryComponents(value) {
      this.queryComponents = value;
    },
    initData: [],
    setInitData(value) {
      this.initData = value;
    },

    editLayout: [],
    setEditLayout(value) {
      this.editLayout = value;
    },

    isEdit: false,
    setEdit(value) {
      this.isEdit = value;
    },

    saveConfig(value) {
      const tempObj = map(value, (item) => {
        const temp = pick(mappings[item.i], ['type', 'name']);
        temp.layout = item;
        return temp;
      });
      axios.post(`iam/choerodon/v1/projects/${projectId}/project_overview_config`, JSON.stringify({
        data: JSON.stringify(tempObj),
      }));
    },

    totalOnlineUser: 0,

    setTotalOnlineUser(data) {
      this.totalOnlineUser = data;
    },
    get getTotalOnlineUser() {
      return this.totalOnlineUser;
    },
  }));
}
