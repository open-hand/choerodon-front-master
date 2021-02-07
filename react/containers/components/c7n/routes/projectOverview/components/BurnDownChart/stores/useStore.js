import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';
import { localPageCacheStore } from '../../../stores/LocalPageCacheStore';

export default function useStore(organizationId, projectId, sprintId) {
  return useLocalStore(() => ({

    selectValue: localPageCacheStore.getItem('project.overview.selectType') || 'remainingEstimatedTime',
    setSelectValue(value) {
      this.selectValue = value;
    },

    checkedValue: true,
    setCheckedValue(value) {
      this.checkedValue = value;
    },

  }));
}
