import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';

export default function useStore(organizationId, projectId, sprintId) {
  return useLocalStore(() => ({

    selectValue: 'remainingEstimatedTime',
    setSelectValue(value) {
      this.selectValue = value;
    },

    checkedValue: true,
    setCheckedValue(value) {
      this.checkedValue = value;
    },

  }));
}
