import { action, computed, observable } from 'mobx';
import { message } from 'choerodon-ui/pro';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import { map, get } from 'lodash';
import axios from '../../components/c7n/tools/axios';

function getDefaultLanguage() {
  let locale;
  if (typeof window !== 'undefined') {
    // locale = navigator.language || navigator.userLanguage || navigator.systemLanguage;
  }
  return locale ? locale.replace('-', '_') : 'zh_CN';
}

class AppState {
  @observable starProject = [];

  @observable recentUse = [];

  @observable dropDownPro = undefined;

  @observable currentTheme = localStorage.getItem('theme') || '';

  @observable currentProject = null;

  @observable menuType = null; // 一个菜单对象 {id:'',name:'',type:''}

  @observable expanded = false;

  @observable guideExpanded = false;

  @observable userInfo = {};

  @observable siteInfo = {};

  @observable debugger = false; // 调试模式

  @observable isUser = false;

  @observable modules = []; // 后端已安装模块

  @observable deployServices = []; // 后端已部署的服务

  @observable projectCategorys = {};

  @observable canShowRoute = false;

  getProjects = () => {
    let p1Data;
    let p2Data;
    const p1 = new Promise((resolve) => {
      axios.get(`/iam/choerodon/v1/organizations/${this.currentMenuType.organizationId}/projects/latest_visit`).then((res) => {
        const data = res.splice(0, 3).map(i => ({
          ...i,
          ...i.projectDTO,
        }));
        this.setRecentUse(data);
        p1Data = data;
        resolve('1');
      })
    });
    const p2 = new Promise((resolve) => {
      axios.get(`/iam/choerodon/v1/organizations/${this.menuType.organizationId}/star_projects`).then((res) => {
        const data = res.splice(0, 6);
        this.setStarProject(data);
        p2Data = data;
        resolve('2');
      });
    })
    Promise.all([p1, p2]).then((result) => {
      this.setCurrentDropDown(p1Data, p2Data);
    }).catch((error) => {
      console.log(error)
    })
  }

  setCurrentDropDown = (data1, data2) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const type = params.get('type');
    const id = params.get('id');
    if (type && type === 'project' && ((data1 && data1.length > 0) || (data2 && data2.length > 0))) {
      const flag = data1.find(i => String(i.id) === String(id)) || data2.find(i => String(i.id) === String(id));
      if (flag) {
        // 最近使用
        this.setDropDownPro(`项目: ${flag.name}`);
      } else {
        this.setDropDownPro(undefined);
      }
    } else {
      this.setDropDownPro(undefined);
    }
  }

  @computed
  get getDropDownPro() {
    return this.dropDownPro;
  }

  @action setDropDownPro(data) {
    this.dropDownPro = data;
  }

  @computed
  get getStarProject() {
    return this.starProject;
  }

  @computed
  get getRecentUse() {
    return this.recentUse;
  }

  @action setStarProject(data) {
    this.starProject = data;
  }

  @action setRecentUse(data) {
    this.recentUse = data;
  }

  @computed
  get getCanShowRoute() {
    return this.canShowRoute;
  }

  @action
  setCanShowRoute(data) {
    this.canShowRoute = data;
  }

  @computed
  get getProjectCategorys() {
    return this.projectCategorys;
  }

  @action
  setProjectCategorys(id, categorys) {
    this.projectCategorys[id] = categorys;
  }

  @computed
  get getCurrentTheme() {
    return this.currentTheme;
  }

  @action
  setCurrentTheme(data) {
    this.currentTheme = data;
  }

  @computed
  get getCurrentProject() {
    return this.currentProject;
  }

  @action
  setCurrentProject(data) {
    this.currentProject = data;
  }

  @computed
  get getUserId() {
    return this.userInfo.id;
  }

  @computed
  get getDebugger() {
    return this.debugger;
  }

  @action
  setDebugger(data) {
    this.debugger = data;
  }

  @computed
  get getType() {
    return this.currentMenuType.type;
  }

  @computed
  get getUserInfo() {
    return this.userInfo;
  }

  @action
  setUserInfo(user) {
    this.userInfo = user;
  }

  @action
  setSiteInfo(site) {
    this.siteInfo = site;
  }

  @computed
  get getSiteInfo() {
    return this.siteInfo;
  }

  @computed
  get getMenuExpanded() {
    return this.expanded;
  }

  @action
  setMenuExpanded(data) {
    this.expanded = data;
  }

  @computed
  get getGuideExpanded() {
    return this.guideExpanded;
  }

  @action
  setGuideExpanded(data) {
    this.guideExpanded = data;
  }

  @computed
  get currentLanguage() {
    return this.userInfo.language || getDefaultLanguage();
  }

  @computed
  get isAuth() {
    return !!this.userInfo.loginName;
  }

  @computed
  get currentMenuType() {
    return this.menuType;
  }

  @computed
  get currentOrginazationOrProjectId() {
    const { id, type, organizationId } = this.menuType;
    if (type === 'project') return id;
    if (type === 'organization') return id || organizationId;
    return null;
  }

  @action
  setAuthenticated(flag) {
    this.isAuthenticated = flag;
  }

  /**
   * 根据menutype是否为项目层 设置项目categorys是否有变化 来判断是否重新查菜单
   * @param data
   */
  setProjectMenuTypeCategorys(data) {
    const newData = data;
    if (data.type === 'project') {
      if (data.categories) {
        if (this.projectCategorys[data?.projectId]) {
          if (JSON.stringify(data.categories) !== JSON.stringify(this.projectCategorys[data?.projectId])) {
            newData.hasChangeCategorys = true;
          }
        }
        this.setProjectCategorys(data.projectId, data.categories);
      }
    }
    return newData;
  }

  @action
  changeMenuType(type, func) {
    const newType = this.setProjectMenuTypeCategorys(type);
    sessionStorage.menType = JSON.stringify(newType);
    sessionStorage.selectData = JSON.stringify(newType);
    sessionStorage.type = newType.type;
    sessionStorage.category = newType.category;
    this.menuType = newType;

    if (func) {
      func();
    }
  }

  @action
  setTypeUser(isUser) {
    sessionStorage.user = isUser ? 'user' : '';
    this.isUser = isUser;
  }

  @computed
  get isTypeUser() {
    return this.isUser;
  }

  @computed
  get currentModules() {
    return this.modules.slice();
  }

  @computed
  get currentServices() {
    return this.deployServices.slice();
  }

  loadUserInfo = () => axios({
    method: 'get',
    url: 'iam/choerodon/v1/users/self',
    routeChangeCancel: false,
    enabledCancelMark: false,
  }).then((res) => {
    res = {
      ...res,
      organizationName: res?.tenantName,
      organizationCode: res?.tenantNum,
    };
    this.setUserInfo(res);
    return res;
  });

  loadOrgDate = (email) => axios({
    url: `/iam/choerodon/v1/organizations/daysRemaining?email=${email}`,
    method: 'get',
    routeChangeCancel: false,
    enabledCancelMark: false,
  });

  loadSiteInfo = () => axios({
    url: '/iam/choerodon/v1/system/setting',
    method: 'get',
    routeChangeCancel: false,
    enabledCancelMark: false,
  });

  checkEnterpriseInfo = () => axios({
    url: '/iam/choerodon/v1/enterprises/default',
    method: 'get',
    routeChangeCancel: false,
    enabledCancelMark: false,
  });

  loadModules = async () => {
    try {
      const res = await axios({
        url: '/hadm/choerodon/v1/services/model',
        method: 'get',
        routeChangeCancel: false,
        enabledCancelMark: false,
      });
      if (res && !res.failed) {
        this.modules = res;
      }
    } catch (e) {
      //
    }
  }

  loadDeployServices = async () => {
    try {
      const res = await axios({
        url: '/hadm/choerodon/v1/services',
        method: 'get',
        routeChangeCancel: false,
        enabledCancelMark: false,
      });
      if (res && !res.failed) {
        this.deployServices = res;
      }
    } catch (e) {
      //
    }
  }
}

const appState = new AppState();
export default appState;
