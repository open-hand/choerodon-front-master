// @ts-nocheck
import stores from '@/containers/stores';

const { AppState } = stores;

/**
 *根据当前的层级获取不一样的路由地址
 * @param {route} route
 * @return {string}
 */
const getRoutePath = (route:string) => {
  const {
    currentMenuType: {
      id, name, type, organizationId, category,
    },
  }: any = AppState;

  if (AppState?.currentMenuType) {
    const search = new URLSearchParams();
    switch (type) {
      case 'site':
        if (AppState.isTypeUser) {
          search.set('type', 'site');
        }
        break;
      case 'organization':
      case 'project':
        search.set('type', type);
        search.set('id', id);
        name && search.set('name', name);
        category && search.set('category', category);
        break;
      case 'user':
        search.set('type', type);
        break;
      default:
    }
    search.set('organizationId', organizationId);
    return {
      pathname: route,
      search: `${search.toString()}`,
    };
  }
  return {
    pathname: '',
    search: '',
  };
};

export default getRoutePath;
