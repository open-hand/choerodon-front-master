import { useLocalStore } from 'mobx-react-lite';
import queryString from 'query-string';
import { axios } from '@choerodon/boot';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import { getRandomBackground } from '@/containers/components/c7n/util';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';

export default function useStore(AppState, history) {
  return useLocalStore(() => ({
    starProjectsList: [],
    pagination: {
      page: 1,
      size: 10,
      total: 0,
    },
    allProjectsParams: '',
    get getAllProjectsParams() {
      return this.allProjectsParams;
    },
    setAllProjectsParams(data) {
      this.allProjectsParams = data;
    },
    get getPagination() {
      return this.pagination;
    },
    setPagination(data) {
      this.pagination = data;
    },
    get getStarProjectsList() {
      return this.starProjectsList;
    },
    setStarProjectsList(data) {
      this.starProjectsList = data;
    },
    allProjects: [],
    get getAllProjects() {
      return this.allProjects;
    },
    setAllProjects(data) {
      this.allProjects = data;
    },
    axiosGetProjects() {
      const { page, size } = this.getPagination;
      axios.get(queryString.parse(history.location.search).organizationId ? `/iam/choerodon/v1/organizations/${queryString.parse(history.location.search).organizationId}/users/${AppState.getUserId}/projects/paging?page=${page}&size=${size}${this.getAllProjectsParams && `&params=${this.getAllProjectsParams}`}` : '').then((res) => {
        this.setAllProjects(res.content.map(r => {
          r.background = getRandomBackground();
          return r;
        }));
        this.setPagination({
          page: res.pageNum,
          size: res.size,
          total: res.totalElements,
        });
      });
    },

    canCreate: false,
    get getCanCreate() {
      return this.canCreate;
    },
    setCanCreate(flag) {
      this.canCreate = flag;
    },

    async checkCreate(organizationId) {
      try {
        const res = await axios.get(`iam/choerodon/v1/organizations/${organizationId}/projects/check_enable_create`);
        this.setCanCreate(res && !res.failed);
      } catch (e) {
        this.setCanCreate(false);
      }
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

    deleteStar(data) {
      const orgId = AppState.currentMenuType.organizationId;
      return orgId && axios.delete(`/iam/choerodon/v1/organizations/${orgId}/star_projects?project_id=${data.id}`);
    },
    starProject(data) {
      const orgId = AppState.currentMenuType.organizationId;
      return orgId && axios.post(`/iam/choerodon/v1/organizations/${orgId}/star_projects`, {
        projectId: data.id,
      });
    },
    handleChangeStarProjects(data) {
      const origin = this.getStarProjectsList;
      if (data.starFlag) {
        origin.unshift(data);
        this.setStarProjectsList(origin);
      } else {
        const index = origin.findIndex(i => String(i.id) === String(data.id));
        origin.splice(index, 1);
        this.setStarProjectsList(origin);
      }
    },
    handleStarProject(data) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        if (data.starFlag) {
          try {
            await this.deleteStar(data);
            data.starFlag = false;
            const item = HeaderStore.getRecentItem.find(r => String(r.id) === String(data.id));
            if (item) {
              item.starFlag = false;
              HeaderStore.setRecentItem(item);
            }
          // eslint-disable-next-line no-empty
          } catch (e) { }
        } else {
          try {
            await this.starProject(data);
            data.starFlag = true;
            const item = HeaderStore.getRecentItem.find(r => String(r.id) === String(data.id));
            if (item) {
              item.starFlag = true;
              HeaderStore.setRecentItem(item);
            }
          // eslint-disable-next-line no-empty
          } catch (e) { }
        }
        resolve();
      });
    },
    axiosGetStarProjects() {
      const orgId = AppState.currentMenuType.organizationId;
      axios.get(`/iam/choerodon/v1/organizations/${orgId}/star_projects`).then((res) => {
        this.setStarProjectsList(res.map(r => {
          r.background = getRandomBackground();
          return r;
        }));
      });
    },
  }));
}
