import { action, computed, observable } from 'mobx';
import axios from '@/components/axios';

function getDefaultLanguage() {
  let locale;
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

  @observable userInfo = {};

  @observable userWizardList = '';

  @observable userWizardStatus = '';

  @observable siteInfo = {};

  @observable isUser = false;

  @observable modules = []; // 后端已安装模块

  @observable deployServices = []; // 后端已部署的服务

  @observable projectCategorys = {};

  getProjects = () => {
    if (this.currentMenuType?.organizationId) {
      const recentProjectPromise = axios.get(
        `/iam/choerodon/v1/organizations/${this.currentMenuType.organizationId}/projects/latest_visit`,
        {
          enabledCancelRoute: false,
        },
      );
      const starProjectPromise = axios.get(
        `/iam/choerodon/v1/organizations/${this.menuType.organizationId}/star_projects`,
        {
          enabledCancelRoute: false,
        },
      );
      Promise.all([recentProjectPromise, starProjectPromise]).then((res) => {
        const [recentProjectData = [], starProjectData = []] = res;
        const tempRecentProjectData = recentProjectData?.map((i) => ({
          ...i,
          ...i.projectDTO,
        }));
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
        this.setDropDownPro(`${flag.name}`);
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
    enabledCancelRoute: false,
  });

  checkEnterpriseInfo = () => axios.get('/iam/choerodon/v1/enterprises/default', {
    enabledCancelRoute: false,
  });

  loadModules = async () => {
    try {
      const res = await axios.get('/hadm/choerodon/v1/services/model', {
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
