import { useLocalStore } from 'mobx-react-lite';
import { statistcApi } from '@/apis';
import { MenuLevelType } from '../interface';
import { BATCH_SIZE } from './CONSTANTS';

export default function useStore() {
  return useLocalStore(() => ({
    // 保存已经打开的当前菜单的key值
    // savedOpenKeys: [],
    // setSavedOpenKeys(value:string[]) {
    //   this.savedOpenKeys = value;
    // },
    // 菜单是否展开
    isExpanded: true,
    setIsExpanded(value:boolean) {
      this.isExpanded = value;
    },

    //  ----------- statistics --------------
    statistics: {},

    counter: 0,

    get getStatisticKeys() {
      return Object.keys(this.statistics);
    },

    handleStatisticCount(code:string, level:MenuLevelType, name:string) {
      if (level in this.statistics) {
        if (code in this.statistics[level]) {
          this.statistics[level][code].count += 1;
        } else {
          this.statistics[level][code] = { count: 1, name };
        }
      } else {
        this.statistics[level] = {};
        this.statistics[level][code] = { count: 1, name };
      }
      this.counter += 1;
      const postData = this.getStatisticKeys.map((type:MenuLevelType) => ({ level: type, menus: Object.keys(this.statistics[type]).map((mCode) => ({ mCode, ...this.statistics[type][mCode] })) }));
      if (postData.reduce((p: any, cur: { menus: any[]; }) => p + cur.menus.reduce((menusP: any, menusCur: { count: any; }) => menusP + menusCur.count, 0), 0) >= BATCH_SIZE) {
        this.uploadStatistics();
        this.counter = 0;
      }
      localStorage.setItem('rawStatistics', JSON.stringify(this.statistics));
    },

    uploadStatistics() {
      const postData = Object.keys(this.statistics).map((type) => ({ rootCode: `choerodon.code.top.${type}`, menus: Object.keys(this.statistics[type]).map((code) => ({ code, ...this.statistics[type][code] })) }));
      if (!postData.every((v) => v.rootCode && ['choerodon.code.top.site', 'choerodon.code.top.organization', 'choerodon.code.top.project', 'choerodon.code.top.user'].includes(v.rootCode))) {
        this.statistics = {};
        return;
      }
      statistcApi.handleMenuClick(JSON.stringify(postData)).then((data:any) => {
        if (!data.failed) {
          this.statistics = {};
        }
      });
    },
  }));
}

export type StoreProps = ReturnType<typeof useStore>;
