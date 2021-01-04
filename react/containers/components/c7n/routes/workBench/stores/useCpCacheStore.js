import { useLocalStore } from 'mobx-react-lite';
import {
  filter, get, map,
} from 'lodash';

export default function useStore(history) {
  return useLocalStore(() => ({
    cacheAppServiceData: [],
    setCacheAppServiceData(value) {
      this.cacheAppServiceData = value;
    },

    cacheQuickLinkData: {},
    setCacheQuickLinkData(value) {
      this.cacheQuickLinkData = value;
    },
  }));
}
