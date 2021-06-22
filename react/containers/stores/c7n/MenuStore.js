/* eslint-disable */
/**
 * Created by jaywoods on 2017/6/24.
 */
import {
  action, computed, get, observable, set,
} from 'mobx';
import _ from 'lodash';
import groupBy from 'lodash/groupBy';
import concat from 'lodash/concat';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';
import axios from '../../components/c7n/tools/axios';
import AppState from './AppState';
import HeaderStore from './HeaderStore';

const BATCH_SIZE = 30;

let isLoadMenu = [];

const loadingTenant = [];

function getMenuType(menuType = AppState.currentMenuType, isUser = AppState.isTypeUser) {
  return isUser ? 'user' : menuType.type;
  // return menuType.type;
}

function filterEmptyMenus(menuData, parent) {
  const newMenuData = menuData.filter((item) => {
    const { name, type, subMenus } = item;
    return name !== null && (type === 'menu' || (subMenus && filterEmptyMenus(subMenus, item).length > 0) || item.modelCode);
    // return name !== null && (type === 'menu_item' || (subMenus !== null && filterEmptyMenus(subMenus, item).length > 0));
  });
  if (parent) {
    parent.subMenus = newMenuData;
  }
  return newMenuData;
}

function changeMenuLevel({ level, child }) {
  child.forEach((item) => {
    item.level = level;
    if (item.subMenus) {
      changeMenuLevel({ level, child: item.subMenus });
    }
  });
}

function insertLcMenuOneMenu(menuItem, groupLcMenu, groupParentLcMenu, parentArr) {
  if (menuItem.modelCode) {
    return;
  }
  if (groupLcMenu[menuItem.code]) {
    const keyGroup = orderBy(groupLcMenu[menuItem.code], ['sort'], ['asc']);
    const insertIndex = parentArr.findIndex((r) => r === menuItem);
    if (insertIndex !== -1) {
      keyGroup.forEach((o, i) => {
        parentArr.splice(insertIndex + 1 + i, 0, o);
      });
    }
  }
  if (groupParentLcMenu[menuItem.code]) {
    menuItem.subMenus = menuItem.subMenus || [];
    const orderGroup = orderBy(groupParentLcMenu[menuItem.code], ['sort'], ['asc']);
    menuItem.subMenus = concat(orderGroup, menuItem.subMenus);
  }
  if (menuItem.subMenus) {
    menuItem.subMenus.forEach((item) => insertLcMenuOneMenu(item, groupLcMenu, groupParentLcMenu, menuItem));
  }
}

function insertLcMenu(menuData, lcMenu) {
  const groupLcMenu = groupBy(lcMenu, 'afterBy');
  const groupNullLcMenu = groupLcMenu.null || [];
  const groupParentLcMenu = groupBy(groupNullLcMenu, 'parentCode');

  menuData.forEach((item) => insertLcMenuOneMenu(item, groupLcMenu, groupParentLcMenu, menuData));
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

  @observable activeMenu = null;

  @observable activeMenuParents = [];

  @observable selected = null;

  @observable leftOpenKeys = [];

  @observable openKeys = [];

  @observable type = null;

  @observable isUser = null;

  @observable id = null;

  @observable notFoundSign = false;

  @observable closedKeys = [];

  // 是否具有site平台层权限 用于避免重复切平台层
  @observable hasSitePermission = true;

  @computed
  get getHasSitePermission() {
    return this.hasSitePermission;
  }

  @action
  setHasSitePermission(data) {
    this.hasSitePermission = data;
  }

  @computed
  get getRequestedSiteMenu() {
    return this.requestedSiteMenu;
  }

  @action
  setRequestedSiteMenu(data) {
    this.requestedSiteMenu = data;
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

  statistics = {};

  counter = 0;

  click(code, level, name) {
    if (level in this.statistics) {
      if (code in this.statistics[level]) {
        this.statistics[level][code].count += 1;
      } else {
        this.statistics[level][code] = { count: 1, name };
      }
    } else {
      this.statistics[level] = {};
      this.statistics[level][code] = { count: 1, name };
    }
    this.counter += 1;
    const postData = Object.keys(this.statistics).map((type) => ({ level: type, menus: Object.keys(this.statistics[type]).map((mCode) => ({ mCode, ...this.statistics[type][mCode] })) }));
    if (postData.reduce((p, cur) => p + cur.menus.reduce((menusP, menusCur) => menusP + menusCur.count, 0), 0) >= BATCH_SIZE) {
      this.uploadStatistics();
      this.counter = 0;
    }
    localStorage.setItem('rawStatistics', JSON.stringify(this.statistics));
  }

  uploadStatistics() {
    const postData = Object.keys(this.statistics).map((type) => ({ rootCode: `choerodon.code.top.${type}`, menus: Object.keys(this.statistics[type]).map((code) => ({ code, ...this.statistics[type][code] })) }));
    if (!postData.every((v) => v.rootCode && ['choerodon.code.top.site', 'choerodon.code.top.organization', 'choerodon.code.top.project', 'choerodon.code.top.user'].includes(v.rootCode))) {
      this.statistics = {};
      return;
    }
    axios.post('/hadm/choerodon/v1/statistic/menu_click/save', JSON.stringify(postData)).then((data) => {
      if (!data.failed) {
        this.statistics = {};
      }
    });
  }

  @computed
  get getActiveMenuRoot() {
    return this.activeMenuRoot;
  }

  @action
  setActiveMenuRoot(data) {
    this.activeMenuRoot = data;
  }

  @action
  setActiveMenuParents(data) {
    this.activeMenuParents = data;
  }

  @action
  setCollapsed(collapsed) {
    this.collapsed = collapsed;
  }

  @action
  setActiveMenu(activeMenu) {
    this.activeMenu = activeMenu;
  }

  @action
  setSelected(selected) {
    this.selected = selected;
  }

  @action
  setLeftOpenKeys(leftOpenKeys) {
    this.leftOpenKeys = leftOpenKeys;
  }

  @action
  setOpenKeys(openKeys) {
    if (openKeys && openKeys.length > 0) {
      this.openKeys = _.difference(Array.from(new Set([...openKeys])), this.closedKeys);
    } else {
      this.openKeys = openKeys;
    }
  }

  @action
  setType(type) {
    this.type = type;
  }

  @action
  setIsUser(isUser) {
    this.isUser = isUser;
  }

  @action
  setId(id) {
    this.id = id;
  }

  @action
  setNotFoundSignSign(value) {
    this.notFoundSign = value;
  }

  @action setOpenkeysBaseonRoot(root) {
    const keys = [];
    function cursive(data, array) {
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

  @action setRootBaseOnActiveMenu() {
    if (this.activeMenu && this.getMenuData && this.getMenuData.length > 0) {
      if (this.activeMenu.level !== this.getMenuData[0].level) {
        this.setActiveMenu(this.getMenuData[0].subMenus[0]);
      }
      const menuRoot = this.getActiveMenuRoot || {};
      const root = this.getMenuData.find((i) => i.id === this.activeMenu.rootId);
      if (root) {
        menuRoot[root.level] = root;
        this.setOpenkeysBaseonRoot(root);
        this.setActiveMenuRoot(JSON.parse(JSON.stringify(menuRoot)));
      }
    }
  }

  @action
  loadMenuData(menuType = AppState.currentMenuType, isUser) {
    this.setRootBaseOnActiveMenu();
    if (isLoadMenu === 1) {
      return new Promise((resolve) => {
        resolve(setTimeout(() => this.loadMenuData(menuType, isUser), 500));
      });
    }
    AppState.setCanShowRoute(false);
    isLoadMenu = 1;
    return new Promise((resolve) => {
      mainFunc.call(this, resolve);
    });

    // return new Promise((resolve) => {
    //   mainFunc.call(this, resolve);
    // });

    async function mainFunc(resolve) {
      try {
      const type = getMenuType(menuType, isUser) || 'site';
        if (type !== 'user') {
        AppState.currentMenuType.type = type;
          if (menuType?.id) {
          AppState.currentMenuType.id = menuType?.id
        }
      }
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
        if (type === 'site') {
          if (AppState.getUserInfo?.currentRoleLevel !== 'site' && this.getHasSitePermission) {
            await axios.put('iam/v1/users/tenant-id?tenantId=0', {
              enabledCancelCache: false,
            });
            const result = await axios.get('/iam/choerodon/v1/switch/site', {
              enabledCancelCache: false,
            });
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
              enabledCancelCache: false,
            });
            AppState.loadUserInfo();
          }
        }
        if (!AppState.currentMenuType.hasChangeCategorys) {
          isLoadMenu = 0;
          AppState.setCanShowRoute(true);
          return resolve(menu);
        }
        delete AppState.menuType.hasChangeCategorys;
        AppState.setCanShowRoute(true);
      }
      async function getMenu(that) {
        const currentOrgId = String(organizationId || new URLSearchParams(window.location.hash.split('?')[1]).get('organizationId') || id);
        let url = '/iam/choerodon/v1/menu';
        if (type === 'project') {
          url += `?projectId=${id}&tenantId=${currentOrgId}`;
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
          method:'get',
          enabledCancelCache: false,
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
          await axios.put('iam/v1/users/tenant-id?tenantId=0', {
            enabledCancelCache: false,
          });
          const result = await axios.get('/iam/choerodon/v1/switch/site', {
            enabledCancelCache: false,
          });
          if (!result) {
            this.setHasSitePermission(false);
          }
        }
      } else if (id && (['project', 'organization'].includes(type))) {
        const orgId = String(organizationId || new URLSearchParams(window.location.hash.split('?')[1]).get('organizationId') || id);
        if (!loadingTenant.includes(orgId)) {
          loadingTenant.push(String(orgId));
          await axios.put(`iam/v1/users/tenant-id?tenantId=${orgId || id}`, {
            enabledCancelCache: false,
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
        AppState.setCanShowRoute(true);
        AppState.userInfo.currentRoleLevel = type;
        isLoadMenu = 0;
        return resolve(data || []);
      }
      isLoadMenu = 0;
      AppState.setCanShowRoute(true);
      } catch (e) {
        AppState.setCanShowRoute(true);
      }
    }
  }

  /**
   * 递归设置rootId
   */
  cursiveSetRootId(params, rootId) {
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
  setMenuData(child, childType, id = AppState.currentMenuType.id) {
    const data = filterEmptyMenus(child).map((item) => this.cursiveSetRootId(item, undefined));
    this.setRootBaseOnActiveMenu();
    if (String(id) && !['user', 'site'].includes(childType)) {
      set(this.menuGroup[childType], id, data);
    } else {
      set(this.menuGroup, childType, data);
    }
    localStorage.setItem('menuGroup', JSON.stringify(this.menuGroup));
  }

  @computed
  get getMenuData() {
    return this.menuData();
  }

  @computed
  get getSiteMenuData() {
    return this.menuData('site', 0);
  }

  menuData(type = getMenuType(), id = AppState.currentMenuType.id) {
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

  treeReduce(tree, callback, childrenName = 'subMenus', parents = []) {
    if (tree.code) {
      parents.push(tree);
    }
    return typeof tree[childrenName] === 'object' ? tree[childrenName]?.some((node, index) => {
      const newParents = parents.slice(0);
      node.parentName = parents[0] && parents[0].name;
      if (node[childrenName] && node[childrenName].length > 0) {
        return this.treeReduce(node, callback, childrenName, newParents);
      }
      // node.parentName = parents[0].name;
      return callback(node, parents, index);
    }) : undefined;
  }
}

const menuStore = new MenuStore();

export default menuStore;
