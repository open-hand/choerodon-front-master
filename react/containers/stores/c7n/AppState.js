import { action, computed, observable } from 'mobx';
import axios from '@/components/axios';

function getDefaultLanguage() {
  let locale;
  if (typeof window !== 'undefined') {
    // locale = navigator.language || navigator.userLanguage || navigator.systemLanguage;
  }
  return locale ? locale.replace('-', '_') : 'zh_CN';
}

class AppState {
  // 一个组织id对应是否是saas组织的list
  @observable isSaasList = undefined;

  @observable helpDocUrl = '';

  @observable starProject = [];

  @observable recentUse = [];

  @observable dropDownPro = null;

  @observable currentTheme = localStorage.getItem('theme') || 'theme4';

  @observable currentProject = null;

  @observable menuType = null; // 一个菜单对象 {id:'',name:'',type:''}

  @observable expanded = false;

  @observable guideExpanded = false;

  @observable userInfo = {};

  @observable userWizardList = '';

  @observable userWizardStatus = '';

  @observable siteInfo = {};

  @observable debugger = false; // 调试模式

  @observable isUser = false;

  @observable modules = []; // 后端已安装模块

  @observable deployServices = []; // 后端已部署的服务

  @observable projectCategorys = {};

  @observable canShowRoute = false;

  getProjects = () => {
    if (this.currentMenuType?.organizationId) {
      const recentProjectPromise = axios.get(
        `/iam/choerodon/v1/organizations/${this.currentMenuType.organizationId}/projects/latest_visit`,
        {
          enabledCancelCache: false,
          enabledCancelRoute: false,
        },
      );
      const starProjectPromise = axios.get(
        `/iam/choerodon/v1/organizations/${this.menuType.organizationId}/star_projects`,
        {
          enabledCancelCache: false,
          enabledCancelRoute: false,
        },
      );
      Promise.all([recentProjectPromise, starProjectPromise]).then((res) => {
        const [recentProjectData = [], starProjectData = []] = res;
        // recentProjectData?.splice(0, 3) 这里不清楚当时为什么只要3个 先注释看看问题
        const tempRecentProjectData = recentProjectData?.map((i) => ({
          ...i,
          ...i.projectDTO,
        }));
        // starProjectData.splice(0, 6)
        const tempStarProjectData = starProjectData;
        this.setRecentUse(tempRecentProjectData);
        this.setStarProject(tempStarProjectData);
        this.setCurrentDropDown(tempRecentProjectData, tempStarProjectData);
      });
    }
  };

  setCurrentDropDown = (data1, data2) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const type = params.get('type');
    const id = params.get('id');
    if (
      type
      && type === 'project'
      && ((data1 && data1.length > 0) || (data2 && data2.length > 0))
    ) {
      const flag = data1.find((i) => String(i.id) === String(id))
        || data2.find((i) => String(i.id) === String(id));
      if (flag) {
        // 最近使用
        this.setDropDownPro(`项目: ${flag.name}`);
      } else {
        this.setDropDownPro();
      }
    } else {
      this.setDropDownPro();
    }
  };

  @computed
  get getIsSaasList() {
    return this.isSaasList;
  }

  @action setIsSaasList(data) {
    this.isSaasList = data;
  }

  @computed
  get getDocUrl() {
    return this.helpDocUrl;
  }

  @action setDocUrl(str) {
    this.helpDocUrl = str;
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

  @computed
  get getUserWizardList() {
    return this.userWizardList;
  }

  @action
  setUserWizardList(list) {
    this.userWizardList = list;
  }

  @computed
  get getUserWizardStatus() {
    return this.userWizardStatus;
  }

  @action
  setUserWizardStatus(list) {
    this.userWizardStatus = list;
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
    if (data?.type === 'project') {
      if (data?.categories) {
        if (this.projectCategorys[(data?.projectId)]) {
          if (
            JSON.stringify(data.categories)
            !== JSON.stringify(this.projectCategorys[(data?.projectId)])
          ) {
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

  loadUserInfo = () => axios
    .get('iam/choerodon/v1/users/self', {
      enabledCancelCache: false,
      enabledCancelRoute: false,
    })
    .then((res) => {
      res = {
        ...res,
        organizationName: res?.tenantName,
        organizationCode: res?.tenantNum,
      };
      this.setUserInfo(res);
      return res;
    });

  loadUserWizard = (organizationId) => axios
    .get(
      `/iam/choerodon/v1/organizations/${organizationId}/user_wizard/list`,
      {
        enabledCancelCache: false,
        enabledCancelRoute: false,
      },
    )
    .then((res) => {
      if (Array.isArray(res)) {
        this.setUserWizardList(res);
      } else {
        this.setUserWizardList('');
      }
      return res;
    });

  // 新手引导完成情况
  loadUserWizardStatus = (organizationId) => axios
    .get(
      `/iam/choerodon/v1/organizations/${organizationId}/user_wizard/list_status`,
      {
        enabledCancelCache: false,
        enabledCancelRoute: false,
      },
    )
    .then((res) => {
      if (Array.isArray(res)) {
        this.setUserWizardStatus(res);
      } else {
        this.setUserWizardStatus('');
      }
      return res;
    });

  loadSiteInfo = () => axios.get('/iam/choerodon/v1/system/setting', {
    enabledCancelCache: false,
    enabledCancelRoute: false,
  });

  checkEnterpriseInfo = () => axios.get('/iam/choerodon/v1/enterprises/default', {
    enabledCancelCache: false,
    enabledCancelRoute: false,
  });

  loadModules = async () => {
    try {
      const res = await axios.get('/hadm/choerodon/v1/services/model', {
        enabledCancelCache: false,
        enabledCancelRoute: false,
      });
      if (res && !res.failed) {
        this.modules = res;
      }
    } catch (e) {
      //
    }
  };

  loadDeployServices = async () => {
    try {
      const res = await axios.get('/hadm/choerodon/v1/services', {
        enabledCancelCache: false,
        enabledCancelRoute: false,
      });
      if (res && !res.failed) {
        this.deployServices = res;
      }
    } catch (e) {
      //
    }
  };
}

const appState = new AppState();
export default appState;
