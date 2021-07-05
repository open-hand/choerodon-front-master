import { useLocalStore } from 'mobx-react-lite';
import { localPageCacheStore } from '@/containers/stores/c7n/LocalPageCacheStore';

export default function useStore() {
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
