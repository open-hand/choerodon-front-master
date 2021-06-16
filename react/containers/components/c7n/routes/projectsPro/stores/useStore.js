import { useLocalStore } from 'mobx-react-lite';
import queryString from 'query-string';
import { axios } from '@/index';
import HeaderStore from '@/containers/stores/c7n/HeaderStore';
import MenuStore from '@/containers/stores/c7n/MenuStore';
import moment from 'moment';
import { getRandomBackground } from '@/containers/components/c7n/util';
import findFirstLeafMenu from '@/containers/components/util/findFirstLeafMenu';
import { historyPushMenu } from '@/utils';
import get from 'lodash/get';

export default function useStore(AppState, history) {
  return useLocalStore(() => ({
    starProjectsList: [],
    pagination: {
      page: 1,
      size: 10,
      total: 0,
    },
    recentProjects: [],
    get getRecentProjects() {
      return this.recentProjects;
    },
    setRecentProjects(data) {
      this.recentProjects = data;
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
    projectLoading: true,
    get getProjectLoading() {
      return this.projectLoading;
    },
    allProjects: [],
    get getAllProjects() {
      return this.allProjects;
    },
    setAllProjects(data) {
      this.allProjects = data;
    },
    axiosGetRecentProjects() {
      axios.get(`/iam/choerodon/v1/organizations/${AppState.currentMenuType.organizationId}/projects/latest_visit`).then((res) => {
        this.setRecentProjects(res);
      });
    },
    axiosGetProjects() {
      const { page, size } = this.getPagination;
      this.projectLoading = true;
      const hasOrgId = queryString.parse(history.location.search).organizationId;
      axios.get(hasOrgId ? `/iam/choerodon/v1/organizations/${hasOrgId}/users/${AppState.getUserId}/projects/paging?page=${page}&size=${size}${this.getAllProjectsParams && `&params=${this.getAllProjectsParams}`}` : '').then((res) => {
        const tempContent = get(res, 'content') ? res.content.map((r) => {
          const unix = String(moment(r.creationDate).unix());
          r.background = getRandomBackground(unix.substring(unix.length - 3));
          return r;
        }) : [];
        this.setAllProjects(tempContent);
        this.setPagination({
          page: res?.pageNum,
          size: res?.size,
          total: res?.totalElements,
        });
        this.projectLoading = false;
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
      if (organizationId) {
        try {
          const res = await axios.get(`iam/choerodon/v1/organizations/${organizationId}/projects/check_enable_create`);
          this.setCanCreate(res && !res.failed);
        } catch (e) {
          this.setCanCreate(false);
        }
      }
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
        // if (route) {
        path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;
        if (String(organizationId)) {
          path += `&organizationId=${organizationId}`;
        }
        // }
        if (path) {
          historyPushMenu(history, path, domain);
        }
        AppState.getProjects();
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
        const index = origin.findIndex((i) => String(i.id) === String(data.id));
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
            this.setRecentProjects(this.recentProjects.map((i) => {
              if (String(i.projectDTO.id) === String(data.id)) {
                i.projectDTO.starFlag = false;
              }
              return i;
            }));
          } catch (e) { }
        } else {
          try {
            await this.starProject(data);
            data.starFlag = true;
            this.setRecentProjects(this.recentProjects.map((i) => {
              if (String(i.projectDTO.id) === String(data.id)) {
                i.projectDTO.starFlag = true;
              }
              return i;
            }));
            // eslint-disable-next-line no-empty
          } catch (e) { }
        }
        resolve();
      });
    },
    axiosGetStarProjects() {
      const orgId = AppState.currentMenuType.organizationId;
      if (orgId) {
        axios.get(`/iam/choerodon/v1/organizations/${orgId}/star_projects`).then((res) => {
          this.setStarProjectsList(get(res, 'length') ? res.map((r) => {
            r.background = getRandomBackground();
            return r;
          }) : []);
        });
      }
    },
    changeStarProjectPos(arr) {
      const orgId = AppState.currentMenuType.organizationId;
      if (orgId) {
        try {
          const res = axios.put(`/iam/choerodon/v1/organizations/${orgId}/star_projects`, JSON.stringify(arr));
          if (res && res.failed) {
            return res;
          }
        } catch (error) {
          throw new Error(error);
        }
      }
      return false;
    },

    async retryProjectSaga(projectId, sagaInstanceIds) {
      try {
        const res = await axios.put(`/hagd/v1/sagas/projects/${projectId}/tasks/instances/retry`, sagaInstanceIds);
        if (res && res.failed) {
          return false;
        }
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },

    async deleteProject(projectId) {
      try {
        const res = await axios.delete(`/iam/choerodon/v1/projects/${projectId}`);
        if (res && res.failed) {
          return false;
        }
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    async handleEnable({ organizationId, projectId, type }) {
      try {
        const res = await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/projects/${projectId}/${type}`);
        if (res && res.failed) {
          return false;
        }
        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
  }));
}
