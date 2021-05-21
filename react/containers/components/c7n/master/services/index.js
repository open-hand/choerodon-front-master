import axios from '../../tools/axios';
import MasterApis from "@/containers/components/c7n/master/apis";

export default class MasterServices {
  static axiosGetGuide({menuId, orgId, proId, guideCode}) {
    return axios.get(MasterApis.getGuideUrl(menuId, orgId, proId, guideCode));
  }
}
