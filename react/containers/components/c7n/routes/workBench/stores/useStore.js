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

export default function useStore(history, AppState) {
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

    viewData: [],
    setViewData(value) {
      this.viewData = value;
    },

    activeTabKey: '',
    setActiveTabKey(key) {
      this.activeTabKey = key;
    },

    isSetting: false,
    setIsSetting(value) {
      this.isSetting = value;
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
        if (typeof menus === 'object') {
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
        }
        // AppState.getProjects();
      });
    },
    loadBacklogs({
      organizationId, projectId, page, type,
    }) {
      return axios.get(`agile/v1/organizations/${organizationId}/backlog/work_bench/personal/backlog_my_star_beacon?page=${page}&size=20${projectId ? `&projectId=${projectId}` : ''}`);
    },
    loadQuestions({
      organizationId, projectId, page, type,
    }) {
      return axios.post(`agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${page}&size=20${projectId ? `&projectId=${projectId}` : ''}`, { type });
    },
    saveConfig(value) {
      return axios.put('iam/v1/dashboards', value);
    },

    rankDashboard(dashboards) {
      return axios.post('iam//v1/dashboard-users/dashboard-rank', [...dashboards]);
    },

    loadDashboardDetail(dashboardId) {
      return axios.get(`iam/v1/dashboard-layouts/${dashboardId}`);
    },
  }));
}
