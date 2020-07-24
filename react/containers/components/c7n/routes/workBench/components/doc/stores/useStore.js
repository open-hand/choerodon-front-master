import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore(AppState) {
  return useLocalStore(() => ({
    docData: [],
    self: false,
    get getDocData() {
      return this.docData;
    },
    setDocData(data) {
      this.docData = data;
    },
    axiosGetDoc(isSelf = false) {
      axios({
        method: 'get',
        url: `/knowledge/v1/organizations/${AppState.currentMenuType.organizationId}/work_space/recent_project_update_list${isSelf ? '/self' : ''}`,
        params: {
          page: 1,
          size: 6,
        },
      }).then((res) => {
        this.setDocData(this.self === isSelf ? this.docData.concat(res.content) : res.content);

        this.self = isSelf;
      });
    },
  }));
}
