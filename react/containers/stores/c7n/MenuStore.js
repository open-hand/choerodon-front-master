/* eslint-disable */

/**
 * Created by jaywoods on 2017/6/24.
 */
import {
  action, computed, get, observable, set,
} from 'mobx';
import _ from 'lodash';
import axios from '@/components/axios';
import AppState from './AppState';
import jsonStringifySafty from '@/utils/jsonStringifySafty'

let isLoadMenu = [];
// 这里记录了查询菜单失败的menuType 下次进来直接返回空 避免失败一次 就不在查询菜单的问题
const failedMenuType = [];


const loadingTenant = [];

// 获取当前Menu的type
export function getMenuType (menuType = AppState.currentMenuType, isUser = AppState.isTypeUser) {
  return isUser ? 'user' : menuType.type;
}

function filterEmptyMenus (menuData, parent) {
  const newMenuData = menuData.filter((item) => {
    const { name, type, subMenus } = item;
    return name !== null && (type === 'menu' || (subMenus && filterEmptyMenus(subMenus, item).length > 0) || item.modelCode);
  });
  if (parent) {
    parent.subMenus = newMenuData;
  }
  return newMenuData;
}

function changeMenuLevel ({ level, child }) {
  child.forEach((item) => {
    item.level = level;
    if (item.subMenus) {
      changeMenuLevel({ level, child: item.subMenus });
    }
  });
}

class MenuStore {
  @observable menuGroup = {
    site: [],
    user: [],
    organization: {},
    project: {},
  };

  // 是否已经请求过平台层菜单
  @observable requestedSiteMenu = false;

  @observable activeMenuRoot = {};

  @observable collapsed = false;
  /** @type any */
  @observable activeMenu = null;

  @observable openKeys = [];

  @observable closedKeys = [];

  @observable type = null;

  @observable id = null;

  // 是否具有site平台层权限 用于避免重复切平台层
  @observable hasSitePermission = true;

  @action
  setCollapsed(collapsed) {
    this.collapsed = collapsed;
  }


  @computed
  get getHasSitePermission () {
    return this.hasSitePermission;
  }

  @action
  setHasSitePermission (data) {
    this.hasSitePermission = data;
  }

  @computed
  get getRequestedSiteMenu () {
    return this.requestedSiteMenu;
  }

  @action
  setRequestedSiteMenu (data) {
    this.requestedSiteMenu = data;
  }

  @computed
  get getActiveMenuRoot () {
    return this.activeMenuRoot;
  }

  @computed
  get getClosedKeys() {
    return this.closedKeys;
  }

  @action
  setClosedKeys(data, isDelete = false) {
    if (!isDelete) {
      this.closedKeys = Array.from(new Set([...this.closedKeys, ...data]));
    } else {
      this.closedKeys = _.difference(this.closedKeys, data);
    }
  }


  @action
  setActiveMenuRoot (data) {
    this.activeMenuRoot = data;
  }

  @action
  setActiveMenu (activeMenu) {
    this.activeMenu = activeMenu;
  }

  @action
  setOpenKeys(openKeys) {
    if (openKeys && openKeys.length > 0) {
      this.openKeys = _.difference(Array.from(new Set([...openKeys])), this.closedKeys);
    } else {
      this.openKeys = openKeys;
    }
  }


  @action setOpenkeysBaseonRoot (root) {
    const keys = [];
    function cursive (data, array) {
      if (data.subMenus && data.subMenus.length > 0) {
        array.push(data.code);
        data.subMenus.forEach((rootItem) => {
          cursive(rootItem, array);
        });
      }
    }
    cursive(root, keys);
    this.setOpenKeys(Array.from(new Set([
      ...keys,
      ...this.openKeys || [],
    ])));
  }

  @action
  clearMenuGroupByLevel (level) {
    if (['site', 'user', 'organization', 'project'].includes(level)) {
      if (['site', 'user'].includes(level)) {
        this.menuGroup[level] = [];
      } else {
        this.menuGroup[level] = {};
      }
    }
  }

  @action setRootBaseOnActiveMenu () {
    let flag = this.activeMenu;
    // 如果当前存在activeMenu并且有
    if (this.activeMenu && this.getMenuData && this.getMenuData.length > 0) {
      if (this.activeMenu.level !== this.getMenuData[0].level) {
        this.setActiveMenu(this.getMenuData[0].subMenus[0]);
        flag = this.getMenuData[0].subMenus[0];
      }
      const menuRoot = this.getActiveMenuRoot || {};
      const root = this.getMenuData.find((i) => i.id === flag.rootId);
      if (root) {
        menuRoot[root.level] = root;
        if (!this.collapsed) {
          this.setOpenkeysBaseonRoot(root);
        }
        this.setActiveMenuRoot(menuRoot);
      }
    }
  }

  judgeFailedMenuType (menuType) {
    const { type, id } = menuType;
    const flag = failedMenuType.find(i => (i.type === type) && i.id === id);
    if (flag) {
      return true;
    }
    return false;
  }

  setCurrentIsLoadMenu(num) {
    if (num === 0) {
      AppState.setIsLoadMenu(false)
    } else {
      AppState.setIsLoadMenu(true)
    }
    isLoadMenu = num;
  }


  @action
  loadMenuData (menuType = AppState.currentMenuType, isUser, setData = true, selfResolve) {
    // 判断当前的菜单是否 再  failedMenuType 这个全局变量中存在
    if (this.judgeFailedMenuType(menuType)) {
      this.setCurrentIsLoadMenu(0);
      // 如果是存在返回一个空数组
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    this.setRootBaseOnActiveMenu();
    if (isLoadMenu === 1) {
      if (selfResolve) {
        this.loadMenuData(menuType, isUser, setData, selfResolve);
      } else {
        return this.loadMenuData(menuType, isUser, setData);
      }
    } else {
      this.setCurrentIsLoadMenu(1);
      if (selfResolve) {
        mainFunc.call(this, selfResolve);
      } else {
        return new Promise((resolve) => {
          mainFunc.call(this, resolve);
        });
      }
    }

    async function mainFunc (resolve) {
      try {
        const type = getMenuType(menuType, isUser) || 'site';
        // 暂时注释，解决appstate赋值与路由不同步导致的接口id错误问题
        // if (setData) {
        //   if (type !== 'user' && typeof AppState.currentMenuType === 'object') {
        //     AppState.currentMenuType.type = type;
        //     if (menuType?.id) {
        //       AppState.currentMenuType.id = menuType?.id
        //     }
        //   }
        // }

        const { id = 0, organizationId, orgId } = menuType;
        const menu = this.menuData(type, id);
        let hasMenu = () => {
          if (type === 'organization') {
            return (orgId && Object.keys(menuStore.menuGroup[type]).map(i => String(i)).includes(String(orgId)))
          } else if (type === 'site') {
            if (this.getRequestedSiteMenu) {
              return true;
            }
          } else {
            return (id && Object.keys(menuStore.menuGroup[type]).map(i => String(i)).includes(String(id)))
          }
          return false;
        }

        if (menu.length || hasMenu()) {
          // 如果当前type是site
          if (type === 'site') {
            // 当前user不是site角色，而且有site的权限
            if (AppState.getUserInfo?.currentRoleLevel !== 'site' && this.getHasSitePermission) {
              await axios.put('iam/v1/users/tenant-id?tenantId=0', null, {
                enabledCancelRoute: false,
              });
              // 组织层切换到平台层需要调用的接口
              const result = await axios.get('/iam/choerodon/v1/switch/site', {
                enabledCancelRoute: false,
              });
              // 返回值为false或者不存在则设置平台层访问权限false
              if (!result) {
                this.setHasSitePermission(false);
              }
              await AppState.loadUserInfo();
            }
          } else if (type === 'organization') {
            const orgId = String(organizationId || new URLSearchParams(window.location.hash.split('?')[1]).get('organizationId') || id);
            if (String(AppState.getUserInfo.tenantId) !== String(orgId)) {

              await axios({
                url: `iam/v1/users/tenant-id?tenantId=${orgId}`,
                method: 'put',
                enabledCancelRoute: false,
              });

              AppState.loadUserInfo();
            }
          }
          if (!AppState.currentMenuType.hasChangeCategorys) {
            this.setCurrentIsLoadMenu(0);
            return resolve(menu);
          }
          delete AppState.menuType.hasChangeCategorys;
        }
        async function getMenu (that) {
          const currentOrgId = String(organizationId || new URLSearchParams(window.location.hash.split('?')[1]).get('organizationId') || id);
          const newId = menuType?.id || id;
          let url = '/cbase/choerodon/v1/menu';
          if (type === 'project') {
            url += `?projectId=${newId}&tenantId=${currentOrgId}`;
          } else if (type === 'organization') {
            url += `?labels=TENANT_MENU&tenantId=${currentOrgId}`;
          } else if (type === 'user') {
            url += '?labels=USER_MENU';
          } else {
            url += '?labels=SITE_MENU&tenantId=0';
            that.setRequestedSiteMenu(true);
          }
          const data = await axios({
            url,
            method: 'get',
            enabledCancelRoute: false,
          });
          const child = filterEmptyMenus(data || []);

          if (type === 'project') {
            changeMenuLevel({ level: 'project', child });
          } else if (type === 'user') {
            changeMenuLevel({ level: 'user', child });
          }

          that.setMenuData(child, type, id);
          return child;
        }
        let flag = 0;
        if (type === 'site') {
          if (AppState.getUserInfo?.currentRoleLevel !== 'site' && this.getHasSitePermission) {
            await axios.put('iam/v1/users/tenant-id?tenantId=0', null, {
              enabledCancelRoute: false,
            });
            const result = await axios.get('/iam/choerodon/v1/switch/site', {
              enabledCancelRoute: false,
            });

            if (!result) {
              this.setHasSitePermission(false);
            }
          }
        } else if (id && (['project', 'organization'].includes(type))) {
          const orgId = String(organizationId || new URLSearchParams(window.location.hash.split('?')[1]).get('organizationId') || id);
          if (!loadingTenant.includes(orgId)) {
            loadingTenant.push(String(orgId));
            await axios.put(`iam/v1/users/tenant-id?tenantId=${orgId || id}`, null, {
              enabledCancelRoute: false,
            });

            loadingTenant.splice(loadingTenant.indexOf(loadingTenant), 1);
          } else {
            flag = 1;
          }
        }
        if (!flag) {
          let data;
          const menu = this.menuData(type, id);
          if (['organization', 'project'].includes(type)) {
            if (!Object.keys(menuStore.menuGroup[type]).includes(id)) {
              data = await getMenu(this);
            }
          } else if (!menu.length && !menu.level) {
            data = await getMenu(this);
          }
          if (AppState.userInfo.currentRoleLevel !== type) {
            AppState.userInfo.currentRoleLevel = type;
            AppState.loadUserInfo();
          }
          AppState.userInfo.currentRoleLevel = type;
          this.setCurrentIsLoadMenu(0);

          return resolve(data || []);
        }
        this.setCurrentIsLoadMenu(0);
      } catch (error) {
        failedMenuType.push(menuType);
        this.setCurrentIsLoadMenu(0);
        throw new Error(e);
      }
    }
  }

  /**
   * 递归设置rootId
   */
  cursiveSetRootId (params, rootId) {
    let newRootId = rootId;
    if (!newRootId) {
      newRootId = params.id;
    }
    params.rootId = newRootId;
    if (params.subMenus && params.subMenus.length > 0) {
      params.subMenus = params.subMenus.map((bItem) => this.cursiveSetRootId(bItem, newRootId));
    }
    return params;
  }

  @action
  setMenuData (child, childType, id = AppState.currentMenuType.id) {
    const data = filterEmptyMenus(child).map((item) => this.cursiveSetRootId(item, undefined));
    this.setRootBaseOnActiveMenu();
    if (String(id) && !['user', 'site'].includes(childType)) {
      set(this.menuGroup[childType], id, data);
    } else {
      set(this.menuGroup, childType, data);
    }
    localStorage.setItem('menuGroup', jsonStringifySafty(this.menuGroup));
  }

  @computed
  get getMenuData () {
    return this.menuData();
  }

  menuData (type = getMenuType(), id = AppState.currentMenuType.id) {
    let data;
    if (type) {
      if (id && !['site', 'user'].includes(type)) {
        data = get(this.menuGroup[type], id);
      } else {
        data = get(this.menuGroup, type);
      }
    }
    return data || [];
  }
}

const menuStore = new MenuStore();

export default menuStore;
