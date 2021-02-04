import { useLocalStore } from 'mobx-react-lite';
import queryString from 'query-string';
import { axios } from '@/index';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import moment from 'moment';
import { getRandomBackground } from '@/containers/components/c7n/util';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';

export default function useStore() {
  return useLocalStore(() => ({
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
  }));
}
