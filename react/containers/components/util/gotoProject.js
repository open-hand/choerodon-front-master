import HeaderStore from '../../stores/c7n/HeaderStore'
import MenuStore, { getMenuType } from '../../stores/c7n/MenuStore';
import findFirstLeafMenu from './findFirstLeafMenu';
import AppState from '../../stores/c7n/AppState';
import { historyPushMenu } from "@/utils";

export default async function handleClickProject(data, history) {
  debugger;
  const {
    id, name, organizationId, category,
  } = data;

  const type = 'project';
  HeaderStore.setRecentItem(data);
  // @ts-ignore
  MenuStore.loadMenuData({ type, id }, false, false).then((menus) => {
    let route = '';
    let path;
    let domain;

    if (menus.length) {
      const { route: menuRoute, domain: menuDomain } = findFirstLeafMenu(menus[0]);
      route = menuRoute;
      domain = menuDomain;
    }
    path = `${route}?type=${type}&id=${id}&name=${encodeURIComponent(name)}${category ? `&category=${category}` : ''}`;

    if (String(organizationId)) {
      path += `&organizationId=${organizationId}`;
    }
    if (path) {
      // @ts-ignore
      const t = getMenuType({ type, id }, false) || 'site';
      if (t !== 'user') {
        AppState.currentMenuType.type = t;
        if (id) {
          AppState.currentMenuType.id = id;
        }
      }
      historyPushMenu(history, path, domain);
    }
    AppState.getProjects();
  });
}
