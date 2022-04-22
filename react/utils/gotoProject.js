import { get, has } from '@choerodon/inject';
import { historyPushMenu } from '@/utils';
import HeaderStore from '../containers/stores/c7n/HeaderStore';
import MenuStore, { getMenuType } from '../containers/stores/c7n/MenuStore';
import AppState from '../containers/stores/c7n/AppState';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';

export default async function handleClickProject(data, history, historyPush) {
  const {
    id, name, organizationId, category,
  } = data;

  const selfEmail = AppState.getUserInfo?.email;

  // 如果是pro或者huawei
  if (has('base-pro:preVerifyProject')) {
    get('base-pro:preVerifyProject')(id, selfEmail, gotoProject);
  } else if (has('base-huawei:preVerifyProject')) {
    get('base-huawei:preVerifyProject')(id, selfEmail, gotoProject);
  } else {
    gotoProject();
  }

  /**
   *
   * @param isOwe 是否已欠费
   */
  function gotoProject(isOwe = false) {
    const type = 'project';
    HeaderStore.setRecentItem(data);
    // @ts-ignore
    MenuStore.loadMenuData({ type, id }, false, false).then((menus) => {
      let route = '';
      let path;
      let domain;

      if (menus.length) {
        const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
        // 如果是欠费 默认跳转到知识库界面
        if (isOwe) {
          route = '/knowledge/project';
        } else {
          route = menuRoute;
        }
        domain = menuDomain;
        if (menus[0].subMenus.length) {
          MenuStore.setActiveMenu(menus[0].subMenus[0]);
          MenuStore.setRootBaseOnActiveMenu();
        }
      }
      path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;

      if (String(organizationId)) {
        path += `&organizationId=${organizationId}`;
      }
      const t = getMenuType({ type, id }, false) || 'site';
      if (t !== 'user') {
        AppState.currentMenuType.type = t;
        if (id) {
          AppState.currentMenuType.id = id;
        }
      }
      if (historyPush && typeof historyPush === 'function') {
        historyPush(path, domain);
      } else {
        historyPushMenu(history, path, domain);
      }
    });
  }
}
