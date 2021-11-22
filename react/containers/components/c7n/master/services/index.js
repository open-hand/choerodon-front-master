import axios from '@/components/axios';
import MasterApis from '@/containers/components/c7n/master/apis';

export default class MasterServices {
  static axiosGetGuide({
    menuId, orgId, proId, tabCode,
  }) {
    return axios.get(MasterApis.getGuideUrl(menuId, orgId, proId, tabCode));
  }

  static axiosGetCheckUserCount(tenantId) {
    return axios.get(MasterApis.getCheckUserCountUrl(tenantId));
  }

  static axiosGetCheckOwner(tenantId) {
    return axios.get(MasterApis.getCheckOwnerUrl(tenantId));
  }

  static axiosDeleteCleanMember(tenantId, userIds) {
    return axios.delete(MasterApis.getCleanMemberUrl(tenantId), {
      data: userIds,
    });
  }

  static axiosGetHelpDoc(props) {
    return axios.get(MasterApis.getHelpDocUrl(props));
  }
}
