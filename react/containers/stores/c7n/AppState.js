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

  loadUserInfo = () => axios.get('iam/choerodon/v1/users/self').then((res) => {
    res = {
      ...res,
      organizationName: res.tenantName,
      organizationCode: res.tenantNum,
    };
    this.setUserInfo(res);
    return res;
  });

  loadOrgDate = (email) => axios.get(`/iam/choerodon/v1/organizations/daysRemaining?email=${email}`);

  loadSiteInfo = () => axios.get('/iam/choerodon/v1/system/setting');

  checkEnterpriseInfo = () => axios.get('/iam/choerodon/v1/enterprises/default');

  loadModules = async () => {
    try {
      const res = await axios.get('/hadm/choerodon/v1/services/model');
      if (res && !res.failed) {
        this.modules = res;
      }
    } catch (e) {
      //
    }
  }

  loadDeployServices = async () => {
    try {
      const res = await axios.get('/hadm/choerodon/v1/services');
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
