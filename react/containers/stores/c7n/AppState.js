import { action, computed, observable } from 'mobx';
import { get as getInject, has as hasInject } from '@choerodon/inject';
// import { usersApi } from '@/apis';
import axios from '@/components/axios';
import jsonStringifySafty from '@/utils/jsonStringifySafty';

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

  /** @type any */
  @observable userInfo = {};

  @observable userWizardStatus = '';

  @observable siteInfo = {};

  @observable isUser = false;

  @observable modules = []; // 后端已安装模块

  @observable deployServices = []; // 后端已部署的服务

  @observable projectCategorys = {};

  // 标识燕千云知识空间
  @observable ycloudSpace = null;

  @observable watermarkInfo = null; // 组织水印配置信息；

  @observable isProjectsLoading = false;

  @observable isLoadMenu = false;

  @action setIsLoadMenu(value) {
    this.isLoadMenu = value;
  }

  @action setYcloudSpace(value) {
    this.ycloudSpace = value;
  }

  @computed
  get getYcloudSpace() {
    return this.ycloudSpace;
  }

  @computed
  get getIsLoadMenu() {
    return this.isLoadMenu;
  }

  getProjects = () => {
    this.isProjectsLoading = true;
    if (this.currentMenuType?.organizationId) {
      try {
        const recentProjectPromise = axios.get(
          `/cbase/choerodon/v1/organizations/${this.currentMenuType.organizationId}/projects/latest_visit`,
          {
            enabledCancelRoute: false,
          },
        );
        const starProjectPromise = axios.get(
          `/cbase/choerodon/v1/organizations/${this.menuType.organizationId}/star_projects`,
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
          this.isProjectsLoading = false;
        }).catch((err) => {
          this.isProjectsLoading = false;
        });
      } catch (e) {
        this.isProjectsLoading = false;
      }
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

  /** @type any */
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
    return this.userInfo.language || getDefaultLanguage(this.userInfo.language);
  }

  @computed
  get isAuth() {
    return !!this.userInfo.loginName;
  }

  /** @type any */
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
            jsonStringifySafty(data.categories)
            !== jsonStringifySafty(this.projectCategorys[(data?.projectId)])
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
    sessionStorage.menType = jsonStringifySafty(newType);
    sessionStorage.selectData = jsonStringifySafty(newType);
    sessionStorage.type = newType.type;
    sessionStorage.category = newType.category;
    if (newType?.id !== this.menuType?.id) {
      if (newType?.type === 'project') {
        axios.post(`/devops/v1/users/sync_group_permission?project_id=${newType?.id}`);
      }
    }
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

  loadUserInfo = (setUserId = true) => axios
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
      if (setUserId) {
        sessionStorage.setItem('userId', res.loginName);
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

  checkEnterpriseInfo = () => axios.get('/cbase/choerodon/v1/enterprises/default', {
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

  @action
  setWatermarkInfo(data) {
    this.watermarkInfo = data;
  }

  @computed
  get getWatermarkInfo() {
    return this.watermarkInfo;
  }

  // 请求组织水印信息
  loadWatermarkInfo = async (orgId, injectFunc) => {
    // const key = 'base-business:loadWatermarkInfo';
    const organizationId = orgId ?? this.menuType?.organizationId;
    if (injectFunc && organizationId) {
      const res = await injectFunc(organizationId);
      this.setWatermarkInfo(res);
    } else {
      this.setWatermarkInfo(null);
    }
  }
}

const appState = new AppState();
export default appState;
