import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';

export default function useStore(history) {
  return useLocalStore(() => ({
    activeStarProject: undefined,
    get getActiveStarProject() {
      return this.activeStarProject;
    },
    setActiveStarProject(data) {
      this.activeStarProject = data;
    },
    handleClickProject(data) {
      const { id, name, organizationId, category } = data;
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
        // if (route) {
        path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
        if (String(organizationId)) {
          path += `&organizationId=${organizationId}`;
        }
        // }
        if (path) {
          historyPushMenu(history, path, domain);
        }
      });
    },
    
    loadQuestions({ organizationId, projectId, page }) {
      return axios.post(`agile/v1/organizations/${organizationId}/work_bench/personal/backlog_issues?page=${page}&size=20${projectId ? `projectId=${projectId}` : ''}`);
    },
  }));
}
