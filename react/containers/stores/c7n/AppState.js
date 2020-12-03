import { action, computed, observable } from 'mobx';
import { message } from 'choerodon-ui/pro';
import getSearchString from '@/containers/components/c7n/util/gotoSome';
import axios from '../../components/c7n/tools/axios';

function getDefaultLanguage() {
  let locale;
  if (typeof window !== 'undefined') {
    // locale = navigator.language || navigator.userLanguage || navigator.systemLanguage;
  }
  return locale ? locale.replace('-', '_') : 'zh_CN';
}

class AppState {
  @observable theme = 'theme4';

  @observable currentProject = null;

  @observable menuType = null; // 一个菜单对象 {id:'',name:'',type:''}

  @observable expanded = false;

  @observable guideExpanded = false;

  @observable userInfo = {};

  @observable siteInfo = {};

  @observable debugger = false; // 调试模式

  @observable isUser = false;

  @computed
  get getTheme() {
    return this.theme;
  }

  @action
  setTheme(data) {
    this.theme = data;
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

  @action
  changeMenuType(type, func) {
    sessionStorage.menType = JSON.stringify(type);
    sessionStorage.selectData = JSON.stringify(type);
    sessionStorage.type = type.type;
    sessionStorage.category = type.category;
    this.menuType = type;
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
}

const appState = new AppState();
export default appState;
