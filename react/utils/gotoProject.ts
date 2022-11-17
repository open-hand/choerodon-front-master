import { get, has } from '@choerodon/inject';
import type { History } from 'history';
import { historyPushMenu } from '@/utils';
import findFirstLeafMenu from '@/utils/findFirstLeafMenu';
import { stores } from '..';

/**
 * 点击跳转到项目 会加载项目菜单等信息
 * //TODO data类型待补充 可以和 to 工具类融合
 * @param data
 * @param history
 * @param historyPush
 */
export default async function handleClickProject(data: any, history: History, historyPush?: any) {
  const {
    id, name, organizationId, category,
  } = data;
  const { MenuStore, AppState, HeaderStore } = stores;
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
      // 暂时注释，解决appstate赋值与路由不同步导致的接口id错误问题
      // const t = getMenuType({ type, id }, false) || 'site';
      // if (t !== 'user') {
      //   AppState.currentMenuType.type = t;
      //   if (id) {
      //     AppState.currentMenuType.id = id;
      //   }
      // }
      if (historyPush && typeof historyPush === 'function') {
        historyPush(path, domain);
      } else {
        historyPushMenu(history, path, domain);
      }
    });
  }
}
