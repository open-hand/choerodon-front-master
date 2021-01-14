import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@/index';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';
import {
  get, map, omit, pick,
} from 'lodash';
import mappings from './mappings';

export default function useStore(history) {
  return useLocalStore(() => ({
    initData: [],
    setInitData(value) {
      this.initData = value;
    },

    activeStarProject: null,
    get getActiveStarProject() {
      return this.activeStarProject;
    },
    setActiveStarProject(data) {
      this.activeStarProject = data;
    },

    // 拖拽的参数

    isEdit: false,
    setEdit(value) {
      this.isEdit = value;
    },

    handleClickProject(data) {
      const {
        id, name, organizationId, category,
      } = data;
      const type = 'project';
      HeaderStore.setRecentItem(data);
      MenuStore.loadMenuData({ type, id }, false).then((menus) => {
        let route = '';
        let path;
        let domain;
        if (menus.length) {
          const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
          route = menuRoute;
          domain = menuDomain;
        }
        path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
        if (String(organizationId)) {
          path += `&organizationId=${organizationId}`;
        }
        if (path) {
          historyPushMenu(history, path, domain);
        }
      });
    },
    loadBacklogs({
      organizationId, projectId, page, type,
    }) {
      return axios.get(`agile/v1/organizations/${organizationId}/backlog/star_beacon/personal/backlog_myStarBeacon?page=${page}&size=20${projectId ? `&projectId=${projectId}` : ''}`);
    },
    loadQuestions({
      organizationId, projectId, page, type,
    }) {
      return axios.post(`agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${page}&size=20${projectId ? `&projectId=${projectId}` : ''}`, { type });
    },
    saveConfig(value) {
      const tempObj = map(value, (item) => {
        const temp = pick(mappings[item.i], ['type', 'name']);
        temp.layout = item;
        return temp;
      });
      axios.post('iam/choerodon/v1/workbench_configs', JSON.stringify({
        data: JSON.stringify(tempObj),
      }));
    },
  }));
}
